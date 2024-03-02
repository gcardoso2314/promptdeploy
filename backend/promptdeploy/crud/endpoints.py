from fastapi import HTTPException
from sqlalchemy.orm import Session
from ..database.models import Endpoint, PromptTemplate
from ..schemas.schemas import EndpointCreate, EndpointUpdate


def create_endpoint(db: Session, endpoint: EndpointCreate):
    # check prompt template exists
    db_prompt_template = (
        db.query(PromptTemplate)
        .filter(PromptTemplate.id == endpoint.prompt_template_id)
        .first()
    )
    if not db_prompt_template:
        raise HTTPException(
            status_code=404,
            detail=f"Prompt template with id {endpoint.prompt_template_id} does not exist",
        )
    db_endpoint = Endpoint(**endpoint.model_dump())
    db.add(db_endpoint)
    db.commit()
    db.refresh(db_endpoint)
    return db_endpoint


def get_endpoint(db: Session, endpoint_id: int):
    return db.query(Endpoint).filter(Endpoint.id == endpoint_id).first()


def get_endpoints(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Endpoint).offset(skip).limit(limit).all()


def update_endpoint(db: Session, endpoint_id: int, endpoint: EndpointUpdate):
    db_endpoint = db.query(Endpoint).filter(Endpoint.id == endpoint_id).first()
    if db_endpoint:
        update_data = endpoint.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_endpoint, key, value)
        db.commit()
        db.refresh(db_endpoint)
    return db_endpoint


def delete_endpoint(db: Session, endpoint_id: int):
    db_endpoint = db.query(Endpoint).filter(Endpoint.id == endpoint_id).first()
    if db_endpoint:
        db.delete(db_endpoint)
        db.commit()
    return db_endpoint


def get_endpoint_by_uuid(db: Session, endpoint_uuid: str):
    endpoint = db.query(Endpoint).filter(Endpoint.uuid == endpoint_uuid).first()
    return endpoint
