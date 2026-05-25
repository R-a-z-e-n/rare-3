from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    product_id: str
    Name: str = Field(alias="name")
    Company: str = Field(alias="company")
    Ingredients: list[str] = Field(alias="ingredients")
    price: float
    category: str = "general"
    concerns_addressed: list[str] = []
    is_sponsored: bool = False

    model_config = {"populate_by_name": True}


class ProductOut(BaseModel):
    product_id: str
    name: str
    company: str
    ingredients: list[str]
    price: float
    category: str
    concerns_addressed: list[str]
    is_sponsored: bool

    model_config = {"from_attributes": True}


class AnalysisResponse(BaseModel):
    status: str
    ml_analysis: dict[str, Any] | None = None
    deepseek_analysis: dict[str, Any] | None = None
    recommendations: list[dict[str, Any]] = []
    reused_profile: bool = False
    message: str | None = None
    dermatologist_cta: bool = False


class FeedbackIn(BaseModel):
    user_id: str
    product_id: str | None = None
    feedback: Literal["worked_well", "no_change", "made_worse", "caused_irritation"]
    ingredients: list[str] = []


class RecommendationOut(BaseModel):
    product_id: str
    rank: int
    reason: str
    created_at: datetime
    product: ProductOut

    model_config = {"from_attributes": True}
