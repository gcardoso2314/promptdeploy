# CRUD operations to manage users in DB

from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException
from ..database import models
from ..schemas import schemas


def create_user(db: Session, user: schemas.UserCreate):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_obj = models.User(email=user.email)
    user_obj.set_password(user.password)
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return {"id": user_obj.id, "email": user_obj.email}
