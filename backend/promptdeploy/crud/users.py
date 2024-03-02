# CRUD operations to manage users in DB

from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from ..database import models
from ..schemas import schemas


def create_user_in_db(db: Session, user: schemas.UserCreate):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_obj = models.User(
        email=user.email, first_name=user.first_name, last_name=user.last_name
    )
    user_obj.set_password(user.password)
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


def get_user_from_db(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return db_user
