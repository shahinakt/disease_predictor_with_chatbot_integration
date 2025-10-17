from sqlmodel import SQLModel, create_engine
import os
import logging

logger = logging.getLogger("database")

# Use DATABASE_URL env var if provided; otherwise fall back to a local SQLite file.
database_url = os.environ.get("DATABASE_URL")
if not database_url:
	database_url = "sqlite:///./database.db"
	logger.warning("DATABASE_URL not set. Falling back to sqlite file at ./database.db")

engine = create_engine(database_url, echo=True)