from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env.local file
load_dotenv(dotenv_path='../.env.local')

# Get MongoDB URI and database name from environment variables
mongoUrl = os.getenv('MONGO_URL')
database_name = 'example'
nextUrl = os.getenv('NEXTAUTH_SECRET')

# Print the loaded environment variables for debugging
print(f"MONGODB_URL: {mongoUrl}")
print(f"DATABASE_NAME: {database_name}")
print(f"NEXTAUTH_URL: {nextUrl}")

# Initialize MongoDB client with the correct URI
client = MongoClient(mongoUrl)
db = client['example']

# Define collections
metadata = db['metadata']
reviews = db['reviews']
users = db['users']