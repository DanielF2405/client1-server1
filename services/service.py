from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
# Database connection setup

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define the Post model
class Post(Base):
    __tablename__ = "Post"
    
    id = Column(Integer, primary_key=True, index=True)
    createdById = Column(Integer, ForeignKey('User.id'), nullable=False)
    # title = Column(String, index=True)
    name = Column(String)
    user = relationship("User", back_populates="posts")

# Define the User model
class User(Base):
    __tablename__ = "User"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    posts = relationship("Post", back_populates="user")

# Create the tables in the database
Base.metadata.create_all(bind=engine)
