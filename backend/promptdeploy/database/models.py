from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
    DateTime,
    JSON,
    Boolean,
    cast,
)
from sqlalchemy.orm import relationship, Mapped, mapped_column, DeclarativeBase
from datetime import datetime
import uuid
from werkzeug.security import generate_password_hash, check_password_hash


def create_endpoint_uuid():
    return str(uuid.uuid4())


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(str(self.hashed_password), password)


class Prompt(Base):
    __tablename__ = "prompts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    templates = relationship("PromptTemplate", back_populates="prompt")


class PromptTemplate(Base):
    __tablename__ = "prompt_templates"

    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, ForeignKey("prompts.id"), index=True)
    template = Column(String, nullable=False)
    variables = Column(JSON, default=list)  # list of variables used in template
    created_at = Column(DateTime, default=datetime.utcnow)

    prompt = relationship("Prompt", back_populates="templates")
    endpoints = relationship("Endpoint", back_populates="template")


class Endpoint(Base):
    __tablename__ = "endpoints"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    uuid = Column(String, unique=True, default=create_endpoint_uuid, nullable=False)
    prompt_template_id = Column(Integer, ForeignKey("prompt_templates.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    template = relationship("PromptTemplate", back_populates="endpoints")
