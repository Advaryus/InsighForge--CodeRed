import pprint
import os
import json
import requests
import arxiv
from typing import Dict, Any, List
from langchain.chains import create_extraction_chain
from langchain_groq import ChatGroq
from langchain_community.document_loaders import AsyncChromiumLoader
from langchain_community.document_transformers import BeautifulSoupTransformer
from scholarly import scholarly
import PyPDF2
from io import BytesIO
import datetime
from flask import request

GROQ_API_KEY = "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"

# Initialize the Groq LLM
llm = ChatGroq(
    model="llama-3.2-90b-vision-preview",
    temperature=0,
    max_tokens=2000,
    timeout=30,
    max_retries=3,
    api_key=GROQ_API_KEY
)

def load_analysis_data(filename: str = "analysis.json") -> List[Dict]:
    """Load existing analysis data"""
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def display_product_options(products: List[Dict]):
    """Display available products and get user selection."""
    print("\nAvailable Products for Analysis:")
    options = []
    for i, product in enumerate(products, 1):
        product_name = product.get('product_name', 'N/A')  # Handle missing product_name
        options.append({"index": i, "product_name": product_name})
    data = json.dumps(options, indent=2)
    return data

def optionPick(products: List[Dict],choice) -> int:
    while True:
        try:
            if 1 <= choice <= len(products):
                return choice - 1
            print("Invalid choice. Please try again.")
        except ValueError:
            print("Please enter a valid number.")

def search_research_papers(product_data: Dict) -> List[Dict]:
    """Search for relevant research papers"""
    print("\nSearching for relevant research papers...")
    
    # Extract key terms from product data
    keywords = product_data['product_name'].split()
    search_query = f"{' '.join(keywords)} innovation technology"
    
    # Search arXiv
    search = arxiv.Search(
        query=search_query,
        max_results=5,
        sort_by=arxiv.SortCriterion.Relevance
    )
    
    papers = []
    for result in search.results():
        paper = {
            'title': result.title,
            'summary': result.summary,
            'authors': [author.name for author in result.authors],
            'url': result.pdf_url,
            'published': str(result.published),
            'doi': result.doi
        }
        papers.append(paper)
    
    return papers

def analyze_papers(papers: List[Dict], product_data: Dict) -> Dict:
    """Analyze research papers for innovation potential and generate insights."""
    print("\nAnalyzing research papers for innovation potential...")
    
    analysis_prompt = f"""
    Product Context:
    {product_data['product_name']}
    
    Based on the following research papers, analyze:
    1. Potential technological innovations
    2. Implementation strategies
    3. Market impact and feasibility
    
    Papers to analyze:
    {json.dumps(papers, indent=2)}
    
    Additionally, provide actionable insights on how to integrate the research findings seamlessly into our product to make it the best in the market. Focus on:
    1. Specific features or functionalities that can be added or improved.
    2. Relevant technological enhancements from the research papers.
    3. Ways to achieve market differentiation and enhance customer satisfaction.
    """
    
    # Use Groq for analysis
    try:
        analysis = llm.invoke(analysis_prompt)
        # Extract textual content from the analysis
        if hasattr(analysis, "content"):
            analysis_content = analysis.content.strip()
        else:
            analysis_content = str(analysis).strip()
    except Exception as e:
        print(f"Error during analysis: {e}")
        analysis_content = "Error: Unable to generate analysis."
    
    return {
        'product_data': product_data,
        'papers': papers,
        'analysis': analysis_content,
        'timestamp': str(datetime.datetime.now())
    }

def save_research_analysis(analysis: Dict, filename: str = "research.json"):
    """Save research analysis to JSON."""
    try:
        existing_data = []
        # Check if the file exists and contains valid JSON
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                try:
                    existing_data = json.load(f)
                except json.JSONDecodeError:
                    print(f"Warning: {filename} contains invalid JSON. Starting fresh.")
        
        # Append the new analysis
        existing_data.append(analysis)
        
        # Save to the file
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(existing_data, f, indent=2, ensure_ascii=False)
        print(f"\nAnalysis saved to {filename}")
    except Exception as e:
        print(f"Error saving analysis: {e}")


def download_papers(papers: List[Dict], base_dir: str = "research_papers"):
    """Download research papers as PDFs"""
    os.makedirs(base_dir, exist_ok=True)
    
    for i, paper in enumerate(papers, 1):
        try:
            response = requests.get(paper['url'])
            if response.status_code == 200:
                filename = f"{base_dir}/paper_{i}.pdf"
                with open(filename, 'wb') as f:
                    f.write(response.content)
                print(f"Downloaded: {filename}")
        except Exception as e:
            print(f"Error downloading paper {i}: {str(e)}")

# def save_research_analysis(analysis: Dict, filename: str = "research.json"):
#     """Save research analysis to JSON"""
#     try:
#         existing_data = []
#         if os.path.exists(filename):
#             with open(filename, 'r', encoding='utf-8') as f:
#                 existing_data = json.load(f)
        
#         existing_data.append(analysis)
        
#         with open(filename, 'w', encoding='utf-8') as f:
#             json.dump(existing_data, f, indent=2, ensure_ascii=False)
#         print(f"\nAnalysis saved to {filename}")
#     except Exception as e:
#         print(f"Error saving analysis: {str(e)}")

def main():
    # Load existing product analysis
    products = load_analysis_data()
    data = request.get_json()
    choice: int = data.get('choice')
    if not products:
        print("No product data found in analysis.json. Please run the scraper first.")
        return
    
    # Let user choose a product

    selected_index = display_product_options(products)
    selected_product = products[optionPick(products,choice)]
    
    print(f"\nAnalyzing: {selected_product.get('product_name', 'N/A')}")
    
    # Search for relevant papers
    papers = search_research_papers(selected_product)
    
    if not papers:
        print("No relevant research papers found.")
        return
    
    # Analyze papers
    analysis = analyze_papers(papers, selected_product)
    
    # Save analysis
    save_research_analysis(analysis)
    
    # Download papers
    download_papers(papers)
    
    print("\nAnalysis complete! Check research.json for results and research_papers/ for downloaded papers.")
    return analysis

