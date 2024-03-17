from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from promptdeploy.api.utils import get_db
from promptdeploy.crud.prompt_templates import (
    create_prompt_template_in_db,
    get_latest_template_from_db,
)
from promptdeploy.schemas.schemas import PromptTemplateCreate, PromptTemplate

router = APIRouter()


@router.post("/{prompt_id}", response_model=PromptTemplate)
def create_template_route(
    prompt_id: int, template: PromptTemplateCreate, db: Session = Depends(get_db)
):
    return create_prompt_template_in_db(db=db, prompt_id=prompt_id, template=template)


@router.get("/latest/{prompt_id}", response_model=PromptTemplate)
def get_latest_template_route(prompt_id: int, db: Session = Depends(get_db)):
    return get_latest_template_from_db(db=db, prompt_id=prompt_id)
