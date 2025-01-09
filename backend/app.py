from flask import Flask, request, jsonify
import ai 
from scraper import scraper as sc

app = Flask(__name__)

@app.route('/api/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    # prompt = data['prompt']
    website = data['website']
    html = sc.scrape_website(website)
    body_content = sc.extract_body(html)
    cleaned_content = sc.clean_body(body_content)
    # split_content = sc.split_dom_content(cleaned_content)
    # analysis = ai.analyze_product(split_content)
    return jsonify({"html": cleaned_content})

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