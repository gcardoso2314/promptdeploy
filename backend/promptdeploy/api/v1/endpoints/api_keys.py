from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from promptdeploy.api.utils import get_db
from promptdeploy.crud.api_keys import (
    create_api_key_in_db,
    get_user_api_keys_in_db,
    delete_api_key_in_db,
)
from promptdeploy.schemas.schemas import ApiKeyCreateResponse, ApiKeyCreate, ApiKey
from promptdeploy.api.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=ApiKeyCreateResponse)
def create_api_key(
    request: ApiKeyCreate, db: Session = Depends(get_db), user=Depends(get_current_user)
):
    return create_api_key_in_db(db, request, user.id)


@router.get("/", response_model=List[ApiKey])
def get_user_api_keys(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return get_user_api_keys_in_db(db, user.id)


@router.delete("/{api_key_id}")
def delete_api_key(
    api_key_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)
):
    return delete_api_key_in_db(db, api_key_id, user.id)
