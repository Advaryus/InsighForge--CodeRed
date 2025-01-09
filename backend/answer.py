import torch
import numpy as np
from transformers import pipeline, AutoTokenizer, AutoModel, AutoModelForSeq2SeqLM
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests  # For calling the scraper API


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

# Function to answer questions using a QA pipeline (e.g., T5 or BERT-based model)
def answer_question(question, context, model_name="t5-large"):
    # Load T5 tokenizer and model
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    # Prepare the input text in T5's expected format
    input_text = f"question: {question} context: {context}"
    
    # Tokenize the input
    inputs = tokenizer(input_text, return_tensors="pt", truncation=True, max_length=512)
    
    # Generate the output
    outputs = model.generate(inputs.input_ids, max_length=500, num_beams=5, early_stopping=True)
    
    # Decode the generated answer
    answer = tokenizer.decode(outputs[0], skip_special_tokens=True)

    
    print("[DEBUG] Generated Answer:", answer)  # Debug log
    
    return answer

# Flask route to scrape and process data

def process_and_answer():
    try:
        data = request.get_json()
        websites = data.get('websites', [])
        question = data.get('question', '')

        if not websites or not question:
            return jsonify({"error": "Websites or question not provided"}), 400

        # Call the scraper API
        scraper_response = requests.post(
            "http://127.0.0.1:5000/api/scrape",  # Replace with your scraper API URL
            json={"websites": websites}
        )

        if scraper_response.status_code != 200:
            return jsonify({"error": "Failed to scrape websites"}), 500

        scraper_data = scraper_response.json()
        html_array = scraper_data.get('html', [])

        # Combine all scraped HTML content into one string
        combined_data = " ".join(html_array)

        print("[DEBUG] Combined Scraped Data:", combined_data[:500])  # Debug log

        # Chunk the content
        chunks = chunk_text(combined_data)

        # Find the most relevant chunk
        relevant_chunk, similarity = find_most_relevant_chunk(question, chunks)

        # Answer the question based on the relevant chunk
        if similarity > 0:  # Threshold for relevance
            answer = answer_question(question, relevant_chunk)
        else:
            answer = "Sorry, I couldn't find relevant information."

        return jsonify({"answer": answer})

    except Exception as e:
        print("[ERROR]", e)  # Debug log
        return jsonify({"error": str(e)}), 500
