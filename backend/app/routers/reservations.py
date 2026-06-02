from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, time, datetime, timedelta
from typing import List, Optional
from ..database import get_db
from .. import models, schemas, auth

router = APIRouter(prefix="/reservations", tags=["Reservations"])

@router.get("/tables", response_model=List[schemas.TableResponse])
def get_tables(db: Session = Depends(get_db)):
    return db.query(models.Table).filter(models.Table.is_active == True).all()

@router.post("/tables", response_model=schemas.TableResponse, status_code=status.HTTP_201_CREATED)
def create_table(
    table_in: schemas.TableCreate,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    db_table = models.Table(**table_in.dict())
    db.add(db_table)
    db.commit()
    db.refresh(db_table)
    return db_table

@router.get("/my", response_model=List[schemas.ReservationResponse])
def get_my_reservations(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Reservation).filter(models.Reservation.user_id == current_user.id).all()

@router.get("/all", response_model=List[schemas.ReservationResponse])
def get_all_reservations(
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(models.Reservation).all()

@router.post("/", response_model=schemas.ReservationResponse, status_code=status.HTTP_201_CREATED)
def create_reservation(
    res_in: schemas.ReservationCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Verify table exists and has capacity
    table = db.query(models.Table).filter(models.Table.id == res_in.table_id).first()
    if not table:
        raise HTTPException(status_code=404, detail="Selected table does not exist")
    
    if table.capacity < res_in.guest_count:
        raise HTTPException(
            status_code=400, 
            detail=f"Selected table only accommodates up to {table.capacity} guests"
        )
    
    # 2. Check for overlaps
    # Overlap formula: existing.start_time < requested.end_time AND existing.end_time > requested.start_time
    overlapping = db.query(models.Reservation).filter(
        models.Reservation.table_id == res_in.table_id,
        models.Reservation.date == res_in.date,
        models.Reservation.status != "cancelled",
        models.Reservation.start_time < res_in.end_time,
        models.Reservation.end_time > res_in.start_time
    ).first()

    if overlapping:
        raise HTTPException(
            status_code=400,
            detail="The selected table is already reserved during this time slot."
        )

    # 3. Create the booking
    new_res = models.Reservation(
        user_id=current_user.id,
        table_id=res_in.table_id,
        date=res_in.date,
        start_time=res_in.start_time,
        end_time=res_in.end_time,
        guest_count=res_in.guest_count,
        special_requests=res_in.special_requests,
        status="confirmed"  # Auto-confirm for simple workflow, can be customized
    )
    db.add(new_res)
    db.commit()
    db.refresh(new_res)
    return new_res

@router.patch("/{res_id}/status", response_model=schemas.ReservationResponse)
def update_reservation_status(
    res_id: int,
    status_str: str, # confirmed, cancelled
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    res = db.query(models.Reservation).filter(models.Reservation.id == res_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found")
        
    # User can cancel their own, admin can update any
    if res.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to modify this reservation")
        
    if status_str not in ["confirmed", "cancelled", "pending"]:
        raise HTTPException(status_code=400, detail="Invalid reservation status")
        
    res.status = status_str
    db.commit()
    db.refresh(res)
    return res
