import torch
import numpy as np
from transformers import AutoTokenizer, AutoModel
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

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
@app.route('/api/process_and_answer', methods=['POST'])
def process_and_answer():
    try:
        data = request.get_json()
        product_insights = data.get("productInsights", "")
        question = "What are the key insights about this product?"

        if not product_insights:
            return jsonify({"error": "Product insights not provided"}), 400

        # Chunk the insights
        chunks = chunk_text(product_insights)

        # Find the most relevant chunk
        relevant_chunk, similarity = find_most_relevant_chunk(question, chunks)

        # Answer the question based on the relevant chunk
        if similarity > 0.5:  # Threshold for relevance
            answer = answer_with_gemini(question, relevant_chunk)
        else:
            answer = "Sorry, I couldn't find relevant information."

        return jsonify({"answer": answer})

    except Exception as e:
        print("[ERROR]", e)
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
