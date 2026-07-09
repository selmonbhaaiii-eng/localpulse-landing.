import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.connection import Base

class TradingAccount(Base):
    __tablename__ = "trading_accounts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    broker = Column(String, nullable=False) # e.g. "Upstox"
    account_name = Column(String, nullable=False) # Nickname
    
    client_id = Column(String, nullable=True) # Upstox App Key
    api_key = Column(String, nullable=True) # Usually same as client_id or separate
    api_secret = Column(String, nullable=True) # Encrypted
    redirect_uri = Column(String, nullable=True) 
    
    access_token = Column(String, nullable=True) # Encrypted
    token_expiry_at = Column(DateTime(timezone=True), nullable=True)
    
    mobile_number = Column(String, nullable=True)
    
    # Status: NOT_CONNECTED, CONNECTED, TOKEN_EXPIRED
    status = Column(String, default="NOT_CONNECTED", nullable=False)
    
    last_login = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship back to User
    user = relationship("User", back_populates="trading_accounts")
