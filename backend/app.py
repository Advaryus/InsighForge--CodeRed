from flask import Flask, request, jsonify
from scraper import scraper as sc
import ai
from bson import ObjectId
from flask_cors import CORS
from database import db
import meta
import comp
import answer as ans

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

def convert_objectid(data):
    if isinstance(data, list):
        return [convert_objectid(item) for item in data]
    elif isinstance(data, dict):
        return {key: convert_objectid(value) for key, value in data.items()}
    elif isinstance(data, ObjectId):
        return str(data)
    else:
        return data

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not Found", "message": "The requested URL was not found on the server."}), 404

@app.route('/processmeta', methods=['POST'])
def processmeta():
    return meta.processmeta()
@app.route('/processcomp', methods=['POST'])
def processcomp():
    return comp.processcomp()
@app.route('/process_and_answer', methods=['POST'])
def process_and_answer():
    return ans.process_and_answer()

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

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('username')
    email = data.get('email')
    password = data.get('password')
    cnfpass = data.get('cnfpass')

    if db.users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

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
    try:
        data = request.get_json()
        websites = data.get('websites', [])
        if not websites:
            return jsonify({"error": "No websites provided"}), 400

        reviews_array = []
        ai_responses = []

        for site in websites:
            try:
                html = sc.scrape_website(site)
                reviews = sc.extract_reviews(html)
                cleaned_content = sc.clean_body('//'.join(reviews))
                reviews_array.append(cleaned_content)

                ai_response = ai.ProductInsightsModel(
                    "What are the main insights from these reviews?", cleaned_content
                )
                ai_responses.append(ai_response.get('llm_insights', "No insights available"))
            except Exception as e:
                reviews_array.append(f"Error processing site {site}: {str(e)}")
                ai_responses.append(None)

        response = jsonify({"reviews": reviews_array, "ai_responses": ai_responses})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response

    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
