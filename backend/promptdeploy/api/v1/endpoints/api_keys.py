from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from promptdeploy.api.utils import get_db
from promptdeploy.crud.api_keys import create_api_key_in_db
from promptdeploy.schemas.schemas import ApiKeyCreateResponse, ApiKeyCreate
from promptdeploy.api.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=ApiKeyCreateResponse)
def create_api_key(
    request: ApiKeyCreate, db: Session = Depends(get_db), user=Depends(get_current_user)
):
    return create_api_key_in_db(db, request, user.id)
