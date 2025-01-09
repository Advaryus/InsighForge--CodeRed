from flask import Flask, request, jsonify
from scraper import scraper as sc
import answer as ans
import meta as meta
import comp as comp

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

    return jsonify({"html": html_array, "meta": meta_array})

@app.route('/process_and_answer', methods=['POST'])
def process_and_answer():
    return ans.process_and_answer()
@app.route('/processmeta', methods=['POST'])
def processmeta():
    return meta.processmeta()
@app.route('/processcomp', methods=['POST'])
def processcomp():
    return comp.processcomp()

if __name__ == '__main__':
    app.run(debug=True)