import os
from datetime import timedelta, datetime
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from promptdeploy.crud.users import get_user_from_db
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from promptdeploy.api.utils import get_db
from promptdeploy.database.models import User as DBUser
from promptdeploy.schemas.schemas import User

SECRET_KEY = os.environ["APP_SECRET_KEY"]
ALGORITHM = "HS256"
OAUTH2_SCHEME = OAuth2PasswordBearer(tokenUrl="token")


def create_jwt_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def authenticate_user(db: Session, username: str, password: str):
    user = db.query(DBUser).filter(DBUser.email == username).first()
    if not (user and user.check_password(password)):
        return
    return User(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
    )


def get_current_user(
    token: str = Depends(OAUTH2_SCHEME), db: Session = Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub", "")
        if user_id is None:
            raise HTTPException(
                status_code=401, detail="Invalid authentication credentials"
            )
    except JWTError:
        raise HTTPException(
            status_code=401, detail="Invalid authentication credentials"
        )

    user = get_user_from_db(db, int(user_id))

    return User(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
    )
