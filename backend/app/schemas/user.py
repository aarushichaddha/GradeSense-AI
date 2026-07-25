from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime
from typing import Optional


class UserLogin(BaseModel):
    username: str
    password: str


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    password: str
    role: Optional[str] = "OPERATOR"
    plant_section: Optional[str] = "Paper Mill #04"


class UserResponse(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    full_name: str
    role: str
    plant_section: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
