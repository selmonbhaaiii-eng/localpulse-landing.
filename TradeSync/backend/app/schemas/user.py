from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from app.core.constants import ROLE_ADMIN

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
