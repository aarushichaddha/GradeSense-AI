from typing import Generic, List, TypeVar, Optional
from pydantic import BaseModel

DataType = TypeVar("DataType")


class PaginatedResponse(BaseModel, Generic[DataType]):
    items: List[DataType]
    total: int
    page: int
    size: int
    pages: int


class MessageResponse(BaseModel):
    message: str
    status: str = "SUCCESS"
