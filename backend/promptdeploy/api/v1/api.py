from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from promptdeploy.api.auth import authenticate_user, create_jwt_token, get_current_user

from promptdeploy.api.utils import get_db
from promptdeploy.api.v1.endpoints import prompts, prompt_templates, endpoints
from promptdeploy.schemas import schemas
from promptdeploy.crud.users import create_user

api_router = APIRouter()
api_router.include_router(prompts.router, prefix="/prompts", tags=["Prompts"])
api_router.include_router(
    prompt_templates.router, prefix="/prompt_templates", tags=["Prompt Templates"]
)
api_router.include_router(endpoints.router, prefix="/endpoints", tags=["Endpoints"])


@api_router.post("/signup/", response_model=schemas.UserCreateResponse)
def create_user_route(user: schemas.UserCreate, db: Session = Depends(get_db)):
    user_obj = create_user(db, user)
    return user_obj


@api_router.post("/user/", response_model=schemas.User)
def get_user_route(
    current_user: schemas.User = Depends(get_current_user),
):
    return current_user


@api_router.post("/login/", response_model=schemas.TokenData)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
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
        "user_id": user.id,
        "user_email": user.email,
        "access_token": access_token,
    }
