from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base, SessionLocal
from . import models
from .routers import auth, menu, reservations

# Create Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BeanCo Coffee Shop Premium API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(menu.router, prefix="/api")
app.include_router(reservations.router, prefix="/api")

# Seed initial data on startup
@app.on_event("startup")
def seed_data():
    db = SessionLocal()
    try:
        # Seed tables if none exist
        if db.query(models.Table).count() == 0:
            default_tables = [
                models.Table(table_number="T1", capacity=2, zone="Lounge"),
                models.Table(table_number="T2", capacity=2, zone="Window"),
                models.Table(table_number="T3", capacity=4, zone="Patio"),
                models.Table(table_number="T4", capacity=4, zone="Main Room"),
                models.Table(table_number="T5", capacity=6, zone="Patio"),
                models.Table(table_number="T6", capacity=8, zone="Main Room"),
            ]
            db.add_all(default_tables)
            db.commit()

        # Seed menu items if none exist
        if db.query(models.MenuItem).count() == 0:
            default_menu = [
                models.MenuItem(
                    name="Signature Espresso",
                    description="Rich, full-bodied with notes of dark chocolate and orange zest.",
                    price=4.5,
                    category="Coffee",
                    image_url="https://images.unsplash.com/photo-1510972527409-cef6e4a4d6f2?auto=format&fit=crop&q=80&w=400",
                    is_available=True,
                    customizable=True
                ),
                models.MenuItem(
                    name="Velvet Flat White",
                    description="Microfoamed milk poured over double ristretto espresso.",
                    price=5.0,
                    category="Coffee",
                    image_url="https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=400",
                    is_available=True,
                    customizable=True
                ),
                models.MenuItem(
                    name="Cold Brew Nitro",
                    description="Slow-steeped cold brew infused with nitrogen for a creamy, draft-beer texture.",
                    price=5.5,
                    category="Drinks",
                    image_url="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400",
                    is_available=True,
                    customizable=False
                ),
                models.MenuItem(
                    name="Pistachio Croissant",
                    description="Flaky, butter-laminated pastry filled with rich pistachio cream and crushed nuts.",
                    price=6.0,
                    category="Bakery",
                    image_url="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400",
                    is_available=True,
                    customizable=False
                ),
                models.MenuItem(
                    name="BeanCo Ceramic Tumbler",
                    description="Double-walled ceramic mug with matte-black finish and wooden details.",
                    price=24.0,
                    category="Merch",
                    image_url="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400",
                    is_available=True,
                    customizable=False
                ),
                models.MenuItem(
                    name="Golden Roast Coffee Beans",
                    description="Ethically sourced single-origin Ethiopian beans with fruit forward flavor.",
                    price=18.5,
                    category="Coffee Beans",
                    image_url="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400",
                    is_available=True,
                    customizable=False
                ),
            ]
            db.add_all(default_menu)
            db.commit()
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to BeanCo Premium Coffee Shop API"}
