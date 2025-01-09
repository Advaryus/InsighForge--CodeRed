from flask import Flask, request, jsonify
from scraper import scraper as sc

from flask_cors import CORS
from database import db

app = Flask(__name__)
CORS(app)
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
    # db.metadata.insert_many(meta_array)
    return jsonify({"html": html_array, "meta": meta_array})

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
    # db.users.insert_one(response)
    return jsonify(response)

# @app.route('/api/get', methods=['GET'])
# def get():
#     return jsonify({"message": "Hello World!"})

if __name__ == '__main__':
    app.run(debug=True)