from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime


# Schemas for Users
class User(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str


class UserCreateResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str


class Token(BaseModel):
    access_token: str


# Schemas for Prompts
class PromptCreate(BaseModel):
    name: str
    variables: list
    description: Optional[str] = None


class PromptUpdate(BaseModel):
    name: Optional[str] = None
    variables: Optional[list] = None
    description: Optional[str] = None


class Prompt(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    variables: list
    created_at: datetime
    updated_at: datetime


# Schemas for PromptTemplates
class PromptTemplateBase(BaseModel):
    template: str


class PromptTemplateCreate(PromptTemplateBase):
    prompt_id: int


class PromptTemplateUpdate(PromptTemplateBase):
    pass


class PromptTemplate(PromptTemplateBase):

    id: int
    prompt_id: int
    created_at: datetime
