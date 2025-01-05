from flask import Flask, request, jsonify

from scraper import scraper as sc

app = Flask(__name__)

@app.route('/api/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    website = data['website']
    html = sc.scrape_website(website)
    body_content = sc.extract_body(html)
    cleaned_content = sc.clean_body(body_content)
    return jsonify({'html': cleaned_content})

@app.route('/api', methods=['GET'])
def api():
    return jsonify({'message': 'Hello, World!'})

if __name__ == '__main__':
    app.run(debug=True)