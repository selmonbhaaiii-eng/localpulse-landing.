from fastapi import APIRouter
from app.api.routes import health, auth, trading_accounts

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(trading_accounts.router, prefix="/trading-accounts", tags=["trading-accounts"])
