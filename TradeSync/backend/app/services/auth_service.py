from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.schemas.user import UserLogin
from app.services.user_service import get_user_by_email
from app.security.hashing import verify_password
from app.security.jwt import create_access_token

async def authenticate_user(db: AsyncSession, login_data: UserLogin) -> User | None:
    user = await get_user_by_email(db, email=login_data.email)
    if not user:
        return None
    if not verify_password(login_data.password, user.password_hash):
        return None
    return user

def create_user_token(user: User) -> str:
    return create_access_token(subject=user.id)
