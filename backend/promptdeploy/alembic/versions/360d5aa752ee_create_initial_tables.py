"""create initial tables

Revision ID: 360d5aa752ee
Revises: 
Create Date: 2024-03-17 14:20:14.098394

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "360d5aa752ee"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        columns=[
            sa.Column("id", sa.Integer, primary_key=True, index=True),
            sa.Column("email", sa.String, unique=True, index=True),
            sa.Column("first_name", sa.String, index=True, nullable=False),
            sa.Column("last_name", sa.String, index=True, nullable=False),
            sa.Column("hashed_password", sa.String, nullable=False),
        ],
    )
    op.create_table(
        "prompts",
        columns=[
            sa.Column("id", sa.Integer, primary_key=True, index=True),
            sa.Column("name", sa.String, index=True, nullable=False),
            sa.Column("description", sa.String, nullable=True),
            sa.Column("created_at", sa.DateTime, default=sa.func.now()),
            sa.Column(
                "updated_at",
                sa.DateTime,
                default=sa.func.now(),
                onupdate=sa.func.now(),
            ),
            sa.Column("variables", sa.JSON, default=list, nullable=False),
            sa.Column(
                "deployment_uuid",
                sa.String,
                nullable=False,
            ),
            sa.Column("is_deployed", sa.Boolean, default=False, nullable=False),
        ],
    )
    op.create_table(
        "prompt_templates",
        columns=[
            sa.Column("id", sa.Integer, primary_key=True, index=True),
            sa.Column("prompt_id", sa.Integer, sa.ForeignKey("prompts.id")),
            sa.Column("template", sa.String, nullable=False),
            sa.Column("created_at", sa.DateTime, default=sa.func.now()),
        ],
    )
    op.create_table(
        "api_keys",
        columns=[
            sa.Column("id", sa.Integer, primary_key=True, index=True),
            sa.Column("name", sa.String, nullable=False),
            sa.Column("hashed_key", sa.String, nullable=False),
            sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id")),
            sa.Column("key_suffix", sa.String, nullable=False),
        ],
    )


def downgrade() -> None:
    pass
