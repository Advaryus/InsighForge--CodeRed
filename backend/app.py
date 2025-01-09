from flask import Flask, request, jsonify
import ai 
from scraper import scraper as sc
from database import db

app = Flask(__name__)

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

# @app.route('/api/ai', methods=['POST'])
# def ai():
#     data = request.get_json()
#     prompt = data['prompt']
#     payload = {
#         'prompt': prompt,
#         'scraped_data': split_content
#     }
#     return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)