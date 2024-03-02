from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import Annotated, List
from promptdeploy.api.auth import get_current_user
from promptdeploy.api.utils import get_db
from promptdeploy.crud.prompts import (
    create_prompt_in_db,
    get_prompt_from_db,
    get_prompts_from_db,
    update_prompt_in_db,
    delete_prompt_in_db,
)
from promptdeploy.schemas.schemas import PromptCreate, Prompt, PromptUpdate, User

router = APIRouter()


@router.post("/", response_model=Prompt)
def create_prompt_route(prompt: PromptCreate, db: Session = Depends(get_db)):
    return create_prompt_in_db(db=db, prompt=prompt)


@router.get("/", response_model=List[Prompt])
def read_prompts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    prompts = get_prompts_from_db(db, skip=skip, limit=limit)
    return prompts


@router.get("/{prompt_id}", response_model=Prompt)
def read_prompt(prompt_id: int, db: Session = Depends(get_db)):
    db_prompt = get_prompt_from_db(db, prompt_id=prompt_id)
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return db_prompt


@router.put("/{prompt_id}", response_model=Prompt)
def update_prompt_route(
    prompt_id: int, prompt: PromptUpdate, db: Session = Depends(get_db)
):
    db_prompt = update_prompt_in_db(db, prompt_id=prompt_id, prompt=prompt)
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return db_prompt


@router.delete("/{prompt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prompt_route(prompt_id: int, db: Session = Depends(get_db)):
    db_prompt = delete_prompt_in_db(db, prompt_id=prompt_id)
    if db_prompt is None:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return {"ok": True}
