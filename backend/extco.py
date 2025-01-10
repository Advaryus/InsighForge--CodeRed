import torch
import numpy as np
from transformers import AutoTokenizer, AutoModel
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import google.generativeai as genai

# Configure Gemini API
genai.configure(api_key="AIzaSyDeMDADXCVYk15R-CyDMfK1BiSlWpMOcno")  # Replace with your actual API Key

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Function to chunk text into smaller pieces
def chunk_text(text, max_length=500):
    chunks = []
    words = text.split()
    for i in range(0, len(words), max_length):
        chunks.append(" ".join(words[i:i + max_length]))
    print("[DEBUG] Generated Chunks:", chunks[:2])  # Debug log
    return chunks

# Function to generate embeddings using Hugging Face model
def generate_embeddings(text, model_name="bert-large-uncased"):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name)
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        embeddings = model(**inputs).last_hidden_state.mean(dim=1)
    print("[DEBUG] Generated Embeddings:", embeddings.numpy())  # Debug log
    del tokenizer, model, inputs
    return embeddings.squeeze().numpy()

# Function to find the most relevant chunk
def find_most_relevant_chunk(question, chunks, model_name="bert-large-uncased"):
    question_embedding = generate_embeddings(question, model_name)
    chunk_embeddings = [generate_embeddings(chunk, model_name) for chunk in chunks]
    similarities = [cosine_similarity([question_embedding], [chunk_embedding])[0][0] for chunk_embedding in chunk_embeddings]
    most_relevant_index = np.argmax(similarities)
    print("[DEBUG] Similarities:", similarities)  # Debug log
    print("[DEBUG] Most Relevant Chunk Index:", most_relevant_index)  # Debug log
    return chunks[most_relevant_index], similarities[most_relevant_index]

# Function to call Gemini API for answering questions
def answer_with_geminis(question, context):
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
            return refine_responses(response.text)
        else:
            return "No answer found."
    except Exception as e:
        print("[ERROR] Gemini API Error:", e)  # Debug log for errors
        return "Error calling Gemini API."

def refine_responses(raw_response):
    # Extract and clean the response text
    lines = raw_response.split("\n")
    refined_lines = [line for line in lines if line.strip() and not line.startswith("*")]
    return " ".join(refined_lines[:3])  # Limit to 3 sentences

# Function to process metadata and compare competitor vs. owner
@app.route('/api/processcomps', methods=['POST'])
def processcomp():
    try:
        # Parse request data
        data = request.get_json()
        competitor_website = data.get('competitor_website', '')  # Competitor website link
        owner_website = data.get('owner_website', '')  # Owner's product website link
        question = 'Which is the best among these two products?'

        # Validate input
        if not competitor_website or not owner_website:
            return jsonify({"error": "Both competitor and owner websites must be provided."}), 400

        # Scrape metadata from competitor website
        competitor_response = requests.post(
            "http://127.0.0.1:5000/api/scrape",  # Replace with scraper API URL
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
            "http://127.0.0.1:5000/api/scrape",  # Replace with scraper API URL
            json={"websites": [owner_website]}
        )

        if owner_response.status_code != 200:
            return jsonify({"error": "Failed to scrape owner website"}), 500

        owner_data = owner_response.json()
        owner_meta = owner_data.get('meta', [])

        if not owner_meta:
            return jsonify({"error": "No metadata retrieved from owner website"}), 400

        # Combine keywords from both sources
        competitor_keywords = " ".join([item.get("keywords", "") for item in competitor_meta if item.get("keywords")])
        owner_keywords = " ".join([item.get("keywords", "") for item in owner_meta if item.get("keywords")])

        # Log combined metadata for debugging
        print("[DEBUG] Competitor Keywords:", competitor_keywords)
        print("[DEBUG] Owner Keywords:", owner_keywords)

        if not competitor_keywords or not owner_keywords:
            return jsonify({"error": "Insufficient keyword data for comparison."}), 400

        # Prepare context for Gemini API
        context = f"""
        Competitor Keywords:
        {competitor_keywords}

        Owner Keywords:
        {owner_keywords}

        Analyze why the owner's product is lagging behind the competitor and provide actionable recommendations.
        """

        # Generate answer using Gemini API
        answer = answer_with_geminis(question, context)

        return jsonify({"answer": answer})

    except Exception as e:
        print("[ERROR]", e)  # Debug log
        return jsonify({"error": str(e)}), 500


# Run Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5001)