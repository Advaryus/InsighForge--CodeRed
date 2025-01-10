import torch
import numpy as np
from transformers import AutoTokenizer, AutoModel
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
# import extco as comp  # Import the comparison module
import requests
from database import db
from bson import ObjectId
from scraper import scraper as sc
import json

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Initialize the Google Gemini API
genai.configure(api_key="AIzaSyDeMDADXCVYk15R-CyDMfK1BiSlWpMOcno")  # Replace with your actual API Key

# Function to chunk text into smaller pieces
def chunk_text(text, max_length=500):
    words = text.split()
    chunks = [" ".join(words[i:i + max_length]) for i in range(0, len(words), max_length)]
    return chunks

# Function to generate embeddings
def generate_embeddings(text, model_name="bert-large-uncased"):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name)
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        embeddings = model(**inputs).last_hidden_state.mean(dim=1)
    return embeddings.squeeze().numpy()

# Function to find the most relevant chunk
def find_most_relevant_chunk(question, chunks, model_name="bert-large-uncased"):
    question_embedding = generate_embeddings(question, model_name)
    chunk_embeddings = [generate_embeddings(chunk, model_name) for chunk in chunks]
    similarities = [cosine_similarity([question_embedding], [chunk_embedding])[0][0] for chunk_embedding in chunk_embeddings]
    most_relevant_index = np.argmax(similarities)
    return chunks[most_relevant_index], similarities[most_relevant_index]

# Function to call Gemini API for answering questions
def answer_with_gemini(question, context):
    try:
        # Combine question and context into the prompt
        prompt = f"""
        You are an AI assistant. Based on the context provided below, analyze the user reviews and feedback. 
        Determine whether the overall sentiment suggests the product is good or not. 
        Provide your conclusion as either "The product is good based on the reviews." or "The product is not good based on the reviews."
        Additionally, include a brief summary of key points from the feedback to support your conclusion.
        
        Context:
        {context}
        
        Analyze the reviews and provide a clear and concise conclusion:
        """
        
        # Call the Gemini API to generate the answer
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        
        if response:
            # Clean the response text to remove unwanted characters
            clean_response = response.text.replace("\n", " ").replace("\\", "").strip()
            return clean_response
        else:
            return "No answer found."
    except Exception as e:
        print("[ERROR] Gemini API Error:", e)
        return "Error generating answer."

# API route to process scraped metadata and answer questions
@app.route('/api/process_and_answers', methods=['POST'])  # Corrected the route name here
def process_and_answer():
    try:
        # Receive the data from the frontend
        data = request.get_json()
        product_insights = data.get("productInsights", "")
        url = data.get("url", "")  # Receiving the URL
        question = "What are the key insights about this product?"

        # Check if product insights are provided
        if not product_insights:
            return jsonify({"error": "Product insights not provided"}), 400

        # Chunk the insights
        chunks = chunk_text(product_insights)

        # Find the most relevant chunk
        relevant_chunk, similarity = find_most_relevant_chunk(question, chunks)

        # Answer the question based on the relevant chunk
        if similarity > 0:  # Threshold for relevance
            answer = answer_with_gemini(question, relevant_chunk)
        else:
            answer = "Sorry, I couldn't find relevant information."

        # Return the answer and the URL
        return jsonify({"answer": answer, "url": url})

    except Exception as e:
        print("[ERROR]", e)
        return jsonify({"error": str(e)}), 500
    
def answer_with_geminis(question,context):
    try:
        # Initialize the model
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Combine question and context into the prompt
        prompt = f"""
        You are an AI assistant. Based on the context provided below, answer the question in a single, concise sentence.

        Context:
        {context}

        Question:
        {question}

        Provide the answer in a single, clean sentence:
        """
        
        # Call the Gemini API to generate the content
        response = model.generate_content(prompt)
        if response:
            # Clean the response text to remove unwanted characters
            clean_response = response.text.replace("\n", " ").replace("\\", "").strip()
            return clean_response
        else:
            return "No answer found."
    except Exception as e:
        print("[ERROR] Gemini API Error:", e)  # Debug log for errors
        return "Error calling Gemini API."

# def refine_responses(raw_response):
#     # Extract and clean the response text
#     lines = raw_response.split("\n")
#     refined_lines = [line for line in lines if line.strip() and not line.startswith("*")]
#     return " ".join(refined_lines[:3])  # Limit to 3 sentences

# Function to process metadata and compare competitor vs. owner
@app.route('/api/processcomps', methods=['POST'])
def processcomp():
    try:
        # Parse request data
        data = request.get_json()
        print("[DEBUG] Received Request Data:", data)
        question = 'Which is the best among these two products?'

        if 'urls' in data and len(data['urls']) >= 2:
            competitor_website = data['urls'][0]  # The first URL as competitor
            owner_website = data['urls'][1]  # The second URL as owner's product
        else:
            competitor_website = ''
            owner_website = ''

        # Validate input
        if not competitor_website or not owner_website:
            
            return jsonify({"error": "Both competitor and owner websites must be provided."}), 400

        # Scrape metadata from competitor website
        competitor_response = requests.post(
            "http://127.0.0.1:5001/api/scrape",  # Replace with scraper API URL
            json={"websites": [competitor_website]}
        )

        if competitor_response.status_code != 200:
            return jsonify({"error": "Failed to scrape competitor website"}), 500

        competitor_data = competitor_response.json()
        competitor_meta = competitor_data.get('meta', [])

        if not competitor_meta:
            return jsonify({"error": "No metadata retrieved from competitor website"}), 400

        # Scrape metadata from owner's website
        owner_response = requests.post(
            "http://127.0.0.1:5001/api/scrape",  # Replace with scraper API URL
            json={"websites": [owner_website]}
        )

        if owner_response.status_code != 200:
            return jsonify({"error": "Failed to scrape owner website"}), 500

        owner_data = owner_response.json()
        owner_meta = owner_data.get('meta', [])

        if not owner_meta:
            return jsonify({"error": "No metadata retrieved from owner website"}), 400

        # Combine keywords from both sources
        # Extract HTML content instead of keywords
        print("[DEBUG] Competitor Metadata:", competitor_meta)
        print("[DEBUG] Owner Metadata:", owner_meta)
        competitor_html = " ".join([item.get("keywords", "") for item in competitor_meta if item.get("keywords")])
        owner_html = " ".join([item.get("keywords", "") for item in owner_meta if item.get("keywords")])

# Debug: Log extracted HTML content
        print("[DEBUG] Extracted Competitor HTML:", competitor_html)
        print("[DEBUG] Extracted Owner HTML:", owner_html)

        if not competitor_html or not owner_html:
            print("[ERROR] No HTML content found in competitor or owner metadata")


        # Prepare context for Gemini API
        context = f"""
        Competitor Keywords:
        {competitor_html}

        Owner Keywords:
        {owner_html}

        Compare features of both products and provide a recommendation based on the analysis.
        """

        # Generate answer using Gemini API
        answer = answer_with_geminis(question,context)
        print("[DEBUG] Response:", answer)
        return jsonify({"answer": answer})
         

    except Exception as e:
        print("[ERROR]", e)  # Debug log
        return jsonify({"error": str(e)}), 500
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
# Run Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5001)