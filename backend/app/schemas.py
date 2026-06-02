from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, time, datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Table Schemas
class TableBase(BaseModel):
    table_number: str
    capacity: int
    zone: str
    is_active: Optional[bool] = True

class TableCreate(TableBase):
    pass

class TableResponse(TableBase):
    id: int

    class Config:
        from_attributes = True

# Reservation Schemas
class ReservationBase(BaseModel):
    table_id: int
    date: date
    start_time: time
    end_time: time
    guest_count: int
    special_requests: Optional[str] = None

class ReservationCreate(ReservationBase):
    pass

class ReservationResponse(ReservationBase):
    id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# MenuItem Schemas
class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str
    image_url: Optional[str] = None
    is_available: Optional[bool] = True
    customizable: Optional[bool] = False

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemResponse(MenuItemBase):
    id: int

    class Config:
        from_attributes = True
