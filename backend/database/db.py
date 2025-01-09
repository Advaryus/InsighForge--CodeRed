from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path='../../.env.local')
mongoUrl = os.getenv('MONGODB_URI')

client = MongoClient(mongoUrl)

db = client['example']

metadata = db['metadata']
