from sqlalchemy import Column, Integer, String, Boolean, Float, Date, Time, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    reservations = relationship("Reservation", back_populates="user")

class Table(Base):
    __tablename__ = "tables"

    id = Column(Integer, primary_key=True, index=True)
    table_number = Column(String, unique=True, nullable=False)
    capacity = Column(Integer, nullable=False)  # 1-8
    zone = Column(String, nullable=False)        # Window, Patio, Lounge, Main Room
    is_active = Column(Boolean, default=True)

    reservations = relationship("Reservation", back_populates="table")

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    table_id = Column(Integer, ForeignKey("tables.id"), nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    guest_count = Column(Integer, nullable=False)
    special_requests = Column(String, nullable=True)
    status = Column(String, default="pending")  # pending, confirmed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reservations")
    table = relationship("Table", back_populates="reservations")

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False)  # Coffee, Drinks, Bakery, Merch, Coffee Beans
    image_url = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)
    customizable = Column(Boolean, default=False)  # size, milk, add-ons
