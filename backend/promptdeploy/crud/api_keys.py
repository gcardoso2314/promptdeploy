# CRUD operations to manage api keys in DB

import secrets
from sqlalchemy.orm import Session
from fastapi import HTTPException
from werkzeug.security import generate_password_hash
from ..database import models
from ..schemas import schemas


def create_api_key_in_db(
    db: Session, api_key: schemas.ApiKeyCreate, user_id: int
) -> models.ApiKeys:
    db_api_key = (
        db.query(models.ApiKeys)
        .filter(models.ApiKeys.name == api_key.name, models.ApiKeys.user_id == user_id)
        .first()
    )
    if db_api_key:
        raise HTTPException(status_code=400, detail="API Key name already exists")

    api_key_obj = models.ApiKeys(name=api_key.name, user_id=user_id)
    # This actually creates the key and sets the hashed_key attribute
    key = secrets.token_urlsafe(16)
    api_key_obj.create_key_hash(key)

    db.add(api_key_obj)
    db.commit()
    db.refresh(api_key_obj)
    return {"key": key}


def get_user_api_keys_in_db(db: Session, user_id: int) -> list[models.ApiKeys]:
    return db.query(models.ApiKeys).filter(models.ApiKeys.user_id == user_id).all()


def get_api_key(db: Session, api_key: str):
    all_api_keys = db.query(models.ApiKeys).all()
    for db_key in all_api_keys:
        if db_key.check_key(api_key):
            return db_key
