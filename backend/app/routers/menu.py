from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("/", response_model=List[schemas.MenuItemResponse])
def get_menu(
    category: Optional[str] = None, 
    search: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    query = db.query(models.MenuItem)
    
    if category:
        query = query.filter(models.MenuItem.category.ilike(category))
    if search:
        query = query.filter(
            (models.MenuItem.name.ilike(f"%{search}%")) | 
            (models.MenuItem.description.ilike(f"%{search}%"))
        )
    
    return query.all()

@router.post("/", response_model=schemas.MenuItemResponse, status_code=status.HTTP_201_CREATED)
def create_menu_item(
    item_in: schemas.MenuItemCreate,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    db_item = models.MenuItem(**item_in.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/{item_id}", response_model=schemas.MenuItemResponse)
def update_menu_item(
    item_id: int,
    item_in: schemas.MenuItemCreate,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    db_item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
        
    for key, value in item_in.dict().items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_item(
    item_id: int,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    db_item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
        
    db.delete(db_item)
    db.commit()
    return
