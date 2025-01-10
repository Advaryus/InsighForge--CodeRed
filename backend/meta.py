import torch
import numpy as np
from transformers import pipeline, AutoTokenizer, AutoModel, AutoModelForSeq2SeqLM
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests  # For calling the scraper API
import google.generativeai as genai

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

genai.configure(api_key="AIzaSyDeMDADXCVYk15R-CyDMfK1BiSlWpMOcno")  # Replace with your actual API Key

# Function to call Gemini API for answering questions
def answer_with_gemini(question, context):
    try:
        # Initialize the model
        model = genai.GenerativeModel("gemini-1.5-flash")
        
        # Combine question and context into the prompt
        prompt = f"""
        You are an AI assistant. Based on the context provided below, answer the question in a single, concise sentence without using any special characters like backslashes or double quotes.

        Context:
        {context}

        Question:
        {question}

        Provide the answer in a single, clean sentence:
        """
        
        # Call the Gemini API to generate the content
        response = model.generate_content(prompt)
        
        if response:
            return refine_response(response.text)
        else:
            return "No answer found."
    except Exception as e:
        print("[ERROR] Gemini API Error:", e)  # Debug log for errors
        return "Error calling Gemini API."
def refine_response(raw_response):
    # Extract and clean the response text
    lines = raw_response.split("\n")
    refined_lines = [line for line in lines if line.strip() and not line.startswith("*")]
    return " ".join(refined_lines[:3])  # Limit to 3 sentences

# Main function to process metadata and get the answer
def processmeta():
    try:
        data = request.get_json()
        websites = data.get('websites', [])  # Accept websites as input
        question = data.get('question', '')
        product = data.get('product', '')

        if not websites or not question:
            return jsonify({"error": "Websites or question not provided"}), 400

        # Call the scraper API to get metadata
        scraper_response = requests.post(
            "http://127.0.0.1:5000/api/scrape",  # Replace with your scraper API URL
            json={"websites": websites}
        )
        # product_response = requests.post(
        #     "http://127.0.0.1:5000/api/scrape",
        #     json={"websites": [product]})
        if scraper_response.status_code != 200:
            return jsonify({"error": "Failed to scrape websites"}), 500

        scraper_data = scraper_response.json()
        meta_array = scraper_data.get('meta', [])  # Extract the metadata
        # product_data=product_response.json()
        # product_meta=product_data.get('meta',[])

        if not meta_array:
            return jsonify({"error": "No metadata retrieved"}), 400

        # Extract keywords from metadata and combine them into one string
        combined_meta = " ".join([item.get("keywords", "") for item in meta_array if item.get("keywords")])

        # Log combined meta for debugging
        print("[DEBUG] Combined Meta:", combined_meta)

        if not combined_meta:
            return jsonify({"error": "No relevant metadata found"}), 400

        # Chunk the combined metadata into smaller pieces for better relevance matching
        chunks = chunk_text(combined_meta)

        # Find the most relevant chunk based on the question
        relevant_chunk, similarity = find_most_relevant_chunk(question, chunks)

        # Answer the question using the CroQ API
        if similarity > 0:  # Threshold for relevance
            answer = answer_with_gemini(question, relevant_chunk)
        else:
            answer = "Sorry, I couldn't find relevant information."

        return jsonify({"answer": answer})

    except Exception as e:
        print("[ERROR]", e)  # Debug log
        return jsonify({"error": str(e)}), 500