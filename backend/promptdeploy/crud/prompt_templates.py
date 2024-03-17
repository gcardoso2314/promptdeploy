from fastapi import HTTPException
from sqlalchemy.orm import Session
from ..database.models import PromptTemplate
from ..schemas.schemas import PromptTemplateCreate
from .prompts import get_prompt_from_db


def create_prompt_template_in_db(
    db: Session, prompt_id: int, template: PromptTemplateCreate
):
    db_prompt = get_prompt_from_db(db, prompt_id)
    if not db_prompt:
        raise HTTPException(
            status_code=404,
            detail=f"Prompt with id {prompt_id} does not exist",
        )

    db_template = PromptTemplate(prompt_id=prompt_id, template=template.template)
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template


def get_latest_template_from_db(db: Session, prompt_id: int):
    latest_template = (
        db.query(PromptTemplate)
        .filter(PromptTemplate.prompt_id == prompt_id)
        .order_by(PromptTemplate.created_at.desc())
        .first()
    )
    if not latest_template:
        raise HTTPException(
            status_code=404,
            detail=f"No template found for prompt with id {prompt_id}",
        )
    return latest_template


def get_prompt_template_from_db(db: Session, template_id: int):
    return db.query(PromptTemplate).filter(PromptTemplate.id == template_id).first()
