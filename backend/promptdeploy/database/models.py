from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    String,
    DateTime,
    JSON,
    Boolean,
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
    first_name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    last_name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(str(self.hashed_password), password)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Prompt(Base):
    __tablename__ = "prompts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    # list of variables used in template
    variables: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    # Deployment configuration
    deployment_uuid: Mapped[str] = mapped_column(
        String, default=create_endpoint_uuid, nullable=False
    )
    deployed_template_id: Mapped[int] = mapped_column(Integer, nullable=True)

    templates = relationship("PromptTemplate", back_populates="prompt")


class PromptTemplate(Base):
    __tablename__ = "prompt_templates"

    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, ForeignKey("prompts.id"), index=True)
    template = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    prompt = relationship(
        "Prompt", back_populates="templates", foreign_keys=[prompt_id]
    )
