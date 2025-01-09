from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path='../../.env.local')
mongoUrl = os.getenv('MONGODB_URI')
print(mongoUrl)

client = MongoClient('MONGO_URI')
db = client['example']

metadata = db['metadata']
users = db['users']
