import torch
import numpy as np
from transformers import pipeline, AutoTokenizer, AutoModel
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS

# Flask app setup
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
def generate_embeddings(text, model_name="sentence-transformers/paraphrase-MiniLM-L6-v2"):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name)
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        embeddings = model(**inputs).last_hidden_state.mean(dim=1)
    print("[DEBUG] Generated Embeddings:", embeddings.numpy())  # Debug log
    del tokenizer, model, inputs
    return embeddings.squeeze().numpy()

# Function to find the most relevant chunk
def find_most_relevant_chunk(question, chunks, model_name="sentence-transformers/paraphrase-MiniLM-L6-v2"):
    question_embedding = generate_embeddings(question, model_name)
    chunk_embeddings = [generate_embeddings(chunk, model_name) for chunk in chunks]
    similarities = [cosine_similarity([question_embedding], [chunk_embedding])[0][0] for chunk_embedding in chunk_embeddings]
    most_relevant_index = np.argmax(similarities)
    print("[DEBUG] Similarities:", similarities)  # Debug log
    print("[DEBUG] Most Relevant Chunk Index:", most_relevant_index)  # Debug log
    return chunks[most_relevant_index], similarities[most_relevant_index]

# Function to answer questions using a QA pipeline (T5 or BERT-based model)
def answer_question(question, context):
    qa_pipeline = pipeline("question-answering", model="t5-large")
    result = qa_pipeline({'question': question, 'context': context})
    print("[DEBUG] QA Result:", result)  # Debug log
    return result['answer']

# Flask route to handle scraped data and answer questions
@app.route('/analyze_and_answer', methods=['POST'])
def analyze_and_answer():
    try:
        # Get scraped data and question from the form
        scraped_data = request.form['scraped_data']
        question = request.form['question']
        print("[DEBUG] Received Scraped Data:", scraped_data[:500])  # Debug log
        print("[DEBUG] Received Question:", question)  # Debug log

        # Check if scraped data is provided
        if not scraped_data:
            return jsonify({"error": "No scraped data provided"}), 400

        # Chunk the content
        chunks = chunk_text(scraped_data)

        # Find the most relevant chunk
        relevant_chunk, similarity = find_most_relevant_chunk(question, chunks)

        # Answer the question based on the relevant chunk
        if similarity > 0.4:  # Threshold for relevance
            answer = answer_question(question, relevant_chunk)
        else:
            answer = "Sorry, I couldn't find relevant information."

        return jsonify({"answer": answer})

    except Exception as e:
        print("[ERROR]", e)  # Debug log
        return jsonify({"error": str(e)}), 500

# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
