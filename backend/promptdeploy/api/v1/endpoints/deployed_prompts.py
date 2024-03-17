from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from promptdeploy.api.utils import get_db
from promptdeploy.crud.prompt_templates import (
    get_latest_template_from_db,
)
from promptdeploy.crud.prompts import get_prompt_by_uuid
from promptdeploy.crud.api_keys import get_api_key
from promptdeploy.schemas.schemas import PromptTemplate

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@router.get("/{deployment_uuid}", response_model=PromptTemplate)
def get_latest_template_route(
    deployment_uuid: str,
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Session = Depends(get_db),
):
    api_key = get_api_key(db=db, api_key=token)
    if not api_key:
        raise HTTPException(status_code=401, detail="Invalid API Key")

    prompt = get_prompt_by_uuid(db=db, uuid=deployment_uuid)
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")

    latest_template = sorted(
        prompt.templates, key=lambda x: x.created_at, reverse=True
    )[0]

    return latest_template
