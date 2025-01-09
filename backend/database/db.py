from pymongo import MongoClient
from dotenv import load_dotenv
from pymongo import MongoClient
import os

load_dotenv(dotenv_path='../.env.local')
mongoUrl = os.getenv('MONGO_URL')
nextUrl = os.getenv('NEXTAUTH_SECRET')
print(f"MONGODB_URL: {mongoUrl}")
print(f"NEXTAUTH_URL: {nextUrl}")

client = MongoClient(mongoUrl)

db = client['example']
metadata = db['metadata']
