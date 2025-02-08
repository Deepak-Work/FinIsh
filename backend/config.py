
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DATABASE_URI = os.environ.get('DATABASE_URL')