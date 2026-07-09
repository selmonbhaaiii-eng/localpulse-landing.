from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.connection import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.schemas.token import Token
from app.models.user import User
from app.services import user_service, auth_service
from app.api.deps import get_current_active_admin
from app.core.exceptions import ForbiddenException, InvalidPasswordException

router = APIRouter()

@router.post("/signup", response_model=UserResponse)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Creates the initial admin user.
    Disabled after the first user is created.
    """
    user_count = await user_service.get_user_count(db)
    if user_count > 0:
        raise ForbiddenException(detail="Signup is disabled. Admin user already exists.")
    
    # Also check if email already exists just in case
    existing_user = await user_service.get_user_by_email(db, user_in.email)
    if existing_user:
        raise ForbiddenException(detail="User with this email already exists.")
        
    user = await user_service.create_admin_user(db, user_in)
    return user

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Authenticate user and return JWT token.
    """
    user = await auth_service.authenticate_user(db, login_data)
    if not user:
        raise InvalidPasswordException()
    if not user.is_active:
        raise ForbiddenException(detail="Inactive user")
        
    access_token = auth_service.create_user_token(user)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_active_admin)):
    """
    Get current logged in user.
    """
    return current_user
