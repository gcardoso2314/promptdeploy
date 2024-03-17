from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from promptdeploy.api.auth import authenticate_user, create_jwt_token, get_current_user

from promptdeploy.api.utils import get_db
from promptdeploy.api.v1.endpoints import (
    prompts,
    prompt_templates,
    api_keys,
    deployed_prompts,
)
from promptdeploy.schemas import schemas
from promptdeploy.crud.users import create_user_in_db

api_router = APIRouter()
api_router.include_router(
    prompts.router,
    prefix="/prompts",
    tags=["Prompts"],
    dependencies=[Depends(get_current_user)],
)
api_router.include_router(
    prompt_templates.router,
    prefix="/prompt_templates",
    tags=["Prompt Templates"],
    dependencies=[Depends(get_current_user)],
)
api_router.include_router(api_keys.router, prefix="/api_keys", tags=["API Keys"])
api_router.include_router(
    deployed_prompts.router, prefix="/deployed_prompts", tags=["Deployed Prompts"]
)


@api_router.post("/register/", response_model=schemas.UserCreateResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = create_user_in_db(db, user)
    return schemas.UserCreateResponse(
        id=db_user.id,
        email=db_user.email,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
    )


@api_router.post("/user/", response_model=schemas.User)
def get_user_from_token(
    current_user: schemas.User = Depends(get_current_user),
):
    return current_user


@api_router.post("/login/", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(
        db=db, username=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_jwt_token(
        data={"sub": str(user.id)}, expires_delta=timedelta(minutes=30)
    )
    return {
        "access_token": access_token,
    }
