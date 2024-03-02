from fastapi import HTTPException
from sqlalchemy.orm import Session
from ..database.models import PromptTemplate
from ..schemas.schemas import PromptTemplateCreate
from .prompts import get_prompt


def create_prompt_template(db: Session, template: PromptTemplateCreate):
    db_prompt = get_prompt(db, template.prompt_id)
    if not db_prompt:
        raise HTTPException(
            status_code=404,
            detail=f"Prompt with id {template.prompt_id} does not exist",
        )

    db_template = PromptTemplate(**template.model_dump())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template


def get_latest_template(db: Session, prompt_id: int):
    return (
        db.query(PromptTemplate)
        .filter(PromptTemplate.prompt_id == prompt_id)
        .order_by(PromptTemplate.created_at.desc())
        .first()
    )


def get_prompt_template(db: Session, template_id: int):
    return db.query(PromptTemplate).filter(PromptTemplate.id == template_id).first()
