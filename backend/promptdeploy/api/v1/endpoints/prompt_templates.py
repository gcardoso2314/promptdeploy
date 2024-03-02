from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from promptdeploy.api.utils import get_db
from promptdeploy.crud.prompt_templates import (
    create_prompt_template,
    get_latest_template,
)
from promptdeploy.schemas.schemas import PromptTemplateCreate, PromptTemplate

router = APIRouter()


@router.post("/", response_model=PromptTemplate)
def create_template_route(
    template: PromptTemplateCreate, db: Session = Depends(get_db)
):
    return create_prompt_template(db=db, template=template)


@router.get("/latest/{prompt_id}", response_model=PromptTemplate)
def get_latest_template_route(prompt_id: int, db: Session = Depends(get_db)):
    return get_latest_template(db=db, prompt_id=prompt_id)
