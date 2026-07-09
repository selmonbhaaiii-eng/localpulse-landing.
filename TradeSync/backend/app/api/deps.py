import jwt
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import ValidationError

from app.database.connection import get_db
from app.models.user import User
from app.schemas.token import TokenPayload
from app.security.jwt import decode_access_token
from app.core.exceptions import CredentialsException, ForbiddenException
from app.core.constants import ROLE_ADMIN

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = decode_access_token(token)
        token_data = TokenPayload(**payload)
    except (jwt.PyJWTError, ValidationError):
        raise CredentialsException()
    
    result = await db.execute(select(User).where(User.id == token_data.sub))
    user = result.scalar_one_or_none()
    
    if not user:
        raise CredentialsException(detail="User not found")
    if not user.is_active:
        raise ForbiddenException(detail="Inactive user")
        
    return user

async def get_current_active_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != ROLE_ADMIN:
        raise ForbiddenException(detail="The user doesn't have enough privileges")
    return current_user
