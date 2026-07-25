from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.core.deps import get_current_active_user
from app.services.auth_service import auth_service
from app.schemas.token import Token
from app.schemas.user import UserLogin, UserResponse
from app.models.user import User

router = APIRouter()


@router.post("/login", response_model=Token, summary="Plant Operator Login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """Authenticate plant operator and return JWT access token."""
    login_dto = UserLogin(username=form_data.username, password=form_data.password)
    access_token = await auth_service.authenticate_operator(db, login_dto)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse, summary="Get Active Operator Profile")
async def get_me(current_user: User = Depends(get_current_active_user)):
    """Retrieve identity profile of currently logged-in plant operator."""
    return current_user
