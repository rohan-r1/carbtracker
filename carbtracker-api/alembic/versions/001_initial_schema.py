"""Initial schema

Revision ID: 001
Revises:
Create Date: 2026-01-29

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create meals table
    op.create_table(
        'meals',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('photo_url', sa.String(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('carbs_logged', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )

    # Create analyses table
    op.create_table(
        'analyses',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('meal_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('meals.id'), nullable=False),
        sa.Column('raw_ai_response', sa.String(), nullable=True),
        sa.Column('preliminary_estimate_min', sa.Float(), nullable=True),
        sa.Column('preliminary_estimate_max', sa.Float(), nullable=True),
        sa.Column('preliminary_estimate_likely', sa.Float(), nullable=True),
        sa.Column('final_estimate', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )

    # Create food_items table
    op.create_table(
        'food_items',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('analysis_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('analyses.id'), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('portion', sa.String(), nullable=True),
        sa.Column('carbs', sa.Float(), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=True),
        sa.Column('is_selected', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('parent_food_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )

    # Create quick_tap_questions table
    op.create_table(
        'quick_tap_questions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('analysis_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('analyses.id'), nullable=False),
        sa.Column('food_item_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('question', sa.String(), nullable=False),
        sa.Column('options', postgresql.JSON(), nullable=False),
        sa.Column('carb_impact', sa.Float(), nullable=True),
        sa.Column('answer', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )

    # Create indexes
    op.create_index('ix_meals_created_at', 'meals', ['created_at'])
    op.create_index('ix_analyses_meal_id', 'analyses', ['meal_id'])
    op.create_index('ix_food_items_analysis_id', 'food_items', ['analysis_id'])
    op.create_index('ix_quick_tap_questions_analysis_id', 'quick_tap_questions', ['analysis_id'])


def downgrade() -> None:
    op.drop_index('ix_quick_tap_questions_analysis_id')
    op.drop_index('ix_food_items_analysis_id')
    op.drop_index('ix_analyses_meal_id')
    op.drop_index('ix_meals_created_at')

    op.drop_table('quick_tap_questions')
    op.drop_table('food_items')
    op.drop_table('analyses')
    op.drop_table('meals')
