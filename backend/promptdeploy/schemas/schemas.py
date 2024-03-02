from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime


# Schemas for Users
class UserCreate(BaseModel):
    email: str
    password: str


class UserInDB(UserCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool


class User(UserInDB):
    pass


class UserCreateResponse(BaseModel):
    id: int
    email: str


class Token(BaseModel):
    access_token: str


class TokenData(Token):
    user_id: Optional[int] = None
    user_email: Optional[str] = None


# Schemas for Prompts
class PromptBase(BaseModel):
    name: str
    description: Optional[str] = None


class PromptCreate(PromptBase):
    pass


class PromptUpdate(PromptBase):
    pass


class PromptInDBBase(PromptBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime


class Prompt(PromptInDBBase):
    pass


# Schemas for PromptTemplates
class PromptTemplateBase(BaseModel):
    template: str
    variables: list


class PromptTemplateCreate(PromptTemplateBase):
    prompt_id: int


class PromptTemplateUpdate(PromptTemplateBase):
    pass


class PromptTemplateInDBBase(PromptTemplateBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class PromptTemplate(PromptTemplateInDBBase):
    prompt_id: int


# Schemas for Endpoints
class EndpointBase(BaseModel):
    name: str
    prompt_template_id: int


class EndpointCreate(EndpointBase):
    pass


class EndpointUpdate(EndpointBase):
    pass


class EndpointInDBBase(EndpointBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: str
    created_at: datetime


class Endpoint(EndpointInDBBase):
    pass
