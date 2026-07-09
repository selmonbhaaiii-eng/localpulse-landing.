from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class TradingAccountBase(BaseModel):
    broker: str
    account_name: str
    client_id: Optional[str] = None
    mobile_number: Optional[str] = None

class TradingAccountCreate(TradingAccountBase):
    api_key: Optional[str] = None
    api_secret: Optional[str] = None

class TradingAccountUpdate(BaseModel):
    account_name: Optional[str] = None
    client_id: Optional[str] = None
    api_key: Optional[str] = None
    api_secret: Optional[str] = None
    mobile_number: Optional[str] = None

class TradingAccountInDBBase(TradingAccountBase):
    id: str
    user_id: str
    status: str
    redirect_uri: Optional[str] = None
    token_expiry_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Properties to return to client (excludes api_secret and access_token)
class TradingAccountResponse(TradingAccountInDBBase):
    pass
