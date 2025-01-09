from flask import Flask, request, jsonify
from scraper import scraper as sc
from bson import ObjectId
# import answer as ans

from flask_cors import CORS
from database import db

app = Flask(__name__)
CORS(app)
def convert_objectid(data):
    if isinstance(data, list):
        return [convert_objectid(item) for item in data]
    elif isinstance(data, dict):
        return {key: convert_objectid(value) for key, value in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

@app.route('/api/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    websites = data.get('websites', [])
    html_array = []
    meta_array = []
    for site in websites:
        html = sc.scrape_website(site)
        body_content = sc.extract_body(html)
        meta_content = sc.extract_meta(html)
        cleaned_content = sc.clean_body(body_content)
        html_array.append(cleaned_content)
        meta_array.append(meta_content)
    result = db.metadata.insert_many(meta_array)
    inserted_ids = [str(id) for id in result.inserted_ids]  # Convert ObjectId to string
    meta_array = convert_objectid(meta_array)  # Convert ObjectId in meta_array
    return jsonify({"html": html_array, "meta": meta_array, "inserted_ids": inserted_ids})

# @app.route('/process_and_answer', methods=['POST'])
# def process_and_answer():
#     return ans.process_and_answer()
  
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('username')
    email = data.get('email')
    password = data.get('password')
    cnfpass = data.get('cnfpass')
    response = {
        "name": name,
        "email": email,
        "password": password,
        "cnfpass": cnfpass
    }
    db.users.insert_one(response)
    return jsonify(response)

@app.route('/api/scrape/reviews', methods=['POST'])
def get_reviews():
    data = request.get_json()
    websites = data.get('websites', [])
    reviews_array = []
    for site in websites:
        html = sc.scrape_website(site)
        reviews = sc.extract_reviews(html)
        if reviews:
            reviews_array.append(reviews)
    result = db.reviews.insert_many(reviews_array)
    inserted_ids = [str(id) for id in result.inserted_ids]  # Convert ObjectId to string
    reviews_array = convert_objectid(reviews_array)  # Convert ObjectId in reviews_array
    return jsonify({"reviews": reviews_array, "inserted_ids": inserted_ids})
if __name__ == '__main__':
    app.run(debug=True)