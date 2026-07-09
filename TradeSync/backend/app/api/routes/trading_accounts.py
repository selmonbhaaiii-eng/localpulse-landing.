from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from typing import List

from app.database.connection import get_db
from app.models.user import User
from app.models.trading_account import TradingAccount
from app.schemas.trading_account import TradingAccountCreate, TradingAccountUpdate, TradingAccountResponse
from app.api.deps import get_current_user
from app.security.encryption import encrypt_token

router = APIRouter()

@router.post("/", response_model=TradingAccountResponse, status_code=status.HTTP_201_CREATED)
async def create_trading_account(
    account_in: TradingAccountCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Prepare data for insertion
    account_data = account_in.model_dump()
    
    # Encrypt api_secret if provided
    if account_data.get("api_secret"):
        account_data["api_secret"] = encrypt_token(account_data["api_secret"])
        
    db_account = TradingAccount(
        **account_data,
        user_id=current_user.id,
        status="NOT_CONNECTED"
    )
    
    db.add(db_account)
    await db.commit()
    await db.refresh(db_account)
    return db_account

@router.get("/", response_model=List[TradingAccountResponse])
async def read_trading_accounts(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(TradingAccount)
        .where(TradingAccount.user_id == current_user.id)
        .offset(skip)
        .limit(limit)
    )
    accounts = result.scalars().all()
    return accounts

@router.put("/{account_id}", response_model=TradingAccountResponse)
async def update_trading_account(
    account_id: str,
    account_in: TradingAccountUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(TradingAccount).where(
            TradingAccount.id == account_id,
            TradingAccount.user_id == current_user.id
        )
    )
    db_account = result.scalars().first()
    if not db_account:
        raise HTTPException(status_code=404, detail="Trading account not found")
        
    update_data = account_in.model_dump(exclude_unset=True)
    
    if "api_secret" in update_data and update_data["api_secret"]:
        update_data["api_secret"] = encrypt_token(update_data["api_secret"])
        
    for field, value in update_data.items():
        setattr(db_account, field, value)
        
    await db.commit()
    await db.refresh(db_account)
    return db_account

@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trading_account(
    account_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(TradingAccount).where(
            TradingAccount.id == account_id,
            TradingAccount.user_id == current_user.id
        )
    )
    db_account = result.scalars().first()
    if not db_account:
        raise HTTPException(status_code=404, detail="Trading account not found")
        
    await db.delete(db_account)
    await db.commit()
    return None
