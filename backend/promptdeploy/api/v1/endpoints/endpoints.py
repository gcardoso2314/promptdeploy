# /app/api/v1/endpoints/endpoints.py

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
from promptdeploy.api.auth import get_current_user
from promptdeploy.api.utils import get_db
from promptdeploy.crud.endpoints import (
    create_endpoint,
    get_endpoint,
    get_endpoint_by_uuid,
    get_endpoints,
    update_endpoint,
    delete_endpoint,
)
from promptdeploy.crud.prompt_templates import get_prompt_template
from promptdeploy.schemas.schemas import EndpointCreate, Endpoint, EndpointUpdate, User

router = APIRouter()


@router.post("/", response_model=Endpoint)
def create_endpoint_route(endpoint: EndpointCreate, db: Session = Depends(get_db)):
    return create_endpoint(db=db, endpoint=endpoint)


@router.get("/", response_model=List[Endpoint])
def read_endpoints(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    endpoints = get_endpoints(db, skip=skip, limit=limit)
    return endpoints


@router.get("/{endpoint_id}", response_model=Endpoint)
def read_endpoint(endpoint_id: int, db: Session = Depends(get_db)):
    db_endpoint = get_endpoint(db, endpoint_id=endpoint_id)
    if db_endpoint is None:
        raise HTTPException(status_code=404, detail="Endpoint not found")
    return db_endpoint


@router.put("/{endpoint_id}", response_model=Endpoint)
def update_endpoint_route(
    endpoint_id: int, endpoint: EndpointUpdate, db: Session = Depends(get_db)
):
    db_endpoint = update_endpoint(db, endpoint_id=endpoint_id, endpoint=endpoint)
    if db_endpoint is None:
        raise HTTPException(status_code=404, detail="Endpoint not found")
    return db_endpoint


@router.delete("/{endpoint_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_endpoint_route(endpoint_id: int, db: Session = Depends(get_db)):
    db_endpoint = delete_endpoint(db, endpoint_id=endpoint_id)
    if db_endpoint is None:
        raise HTTPException(status_code=404, detail="Endpoint not found")
    return {"ok": True}


@router.get("/deployments/{endpoint_uuid}")
def query_prompt_endpoint(
    endpoint_uuid: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Look up the UUID part of the path in the database to find the matching endpoint
    endpoint = get_endpoint_by_uuid(db, endpoint_uuid)
    if not endpoint:
        raise HTTPException(status_code=404, detail="Endpoint not found")

    template = get_prompt_template(db, template_id=endpoint.prompt_template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template
