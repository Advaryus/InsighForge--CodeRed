import pprint
import os
import json
from typing import Dict, Any, List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.chains import create_extraction_chain
from langchain_groq import ChatGroq
from langchain_community.document_transformers import Html2TextTransformer
from langchain_community.document_loaders import AsyncChromiumLoader
from langchain_community.document_transformers import BeautifulSoupTransformer
GROQ_API_KEY = "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"

# Set a default User-Agent
os.environ['USER_AGENT'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

# Initialize the Groq LLM
llm = ChatGroq(
    model="llama-3.2-90b-vision-preview",
    temperature=0,
    max_tokens=2000,  # Increased for more content
    timeout=30,
    max_retries=3,
    api_key=GROQ_API_KEY
)

# Updated schema for e-commerce products
schema = {
    "properties": {
        "product_name": {
            "type": "string",
            "description": "The full name of the product"
        },
        "current_price": {
            "type": "string",
            "description": "The current selling price including currency symbol"
        },
        "original_price": {
            "type": "string",
            "description": "The original price before discount including currency symbol"
        },
        "discount_percentage": {
            "type": "string",
            "description": "The discount percentage if available"
        },
        "rating": {
            "type": "string",
            "description": "Product rating out of 5 stars"
        },
        "review_count": {
            "type": "string",
            "description": "Number of customer reviews"
        },
        "seller_name": {
            "type": "string",
            "description": "Name of the seller"
        },
        "available_offers": {
            "type": "array",
            "items": {"type": "string"},
            "description": "List of available offers and deals"
        },
        "product_highlights": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Key features and highlights of the product"
        }
    },
    "required": ["product_name", "current_price"]
}

def save_to_json(data: List[Dict], filename: str = "analysis.json") -> None:
    """Save the scraped data to a JSON file."""
    try:
        # Load existing data if file exists
        existing_data = []
        if os.path.exists(filename):
            with open(filename, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
        
        # Append new data
        if isinstance(existing_data, list):
            existing_data.extend(data)
        else:
            existing_data = data
            
        # Save combined data
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(existing_data, f, indent=2, ensure_ascii=False)
        print(f"\nData successfully saved to {filename}")
        
    except Exception as e:
        print(f"Error saving to JSON: {str(e)}")

def extract(content: str, schema: Dict[str, Any]) -> Dict[str, Any]:
    try:
        chain = create_extraction_chain(
            schema=schema,
            llm=llm
        )
        
        response = chain.invoke({"input": content})
        
        if response and isinstance(response, dict) and 'text' in response:
            return response['text']
        return None
        
    except Exception as e:
        print(f"Extraction error: {str(e)}")
        return None

def scrape_with_playwright(urls: list, schema: Dict[str, Any]) -> Dict[str, Any]:
    try:
        print("Loading URLs...")
        loader = AsyncChromiumLoader(urls)
        docs = loader.load()
        
        if not docs:
            print("No documents were loaded")
            return None
            
        print(f"Successfully loaded {len(docs)} documents")
        
        # Transform HTML - updated tags for e-commerce
        bs_transformer = BeautifulSoupTransformer()
        docs_transformed = bs_transformer.transform_documents(
            docs,
            tags_to_extract=[
                "div", "span", "p", "h1", "h2", "section",
                "button", "li", "ul", "table", "tr", "td"
            ]
        )
        
        if not docs_transformed or not docs_transformed[0].page_content.strip():
            print("No usable content after transformation")
            return None
            
        print("Content transformed successfully")
        
        # Split into larger chunks for more context
        splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            chunk_size=2000,  # Increased chunk size
            chunk_overlap=200
        )
        splits = splitter.split_documents(docs_transformed)
        
        if not splits:
            print("No content after splitting")
            return None
            
        print(f"Split into {len(splits)} chunks")
        
        # Process chunks with meaningful content
        extracted_contents = []
        for split in splits:
            content = split.page_content.strip()
            if len(content) > 100:
                print("\nAttempting content extraction...")
                extracted_content = extract(schema=schema, content=content)
                if extracted_content:
                    extracted_contents.extend(extracted_content)
        
        return extracted_contents if extracted_contents else None
        
    except Exception as e:
        print(f"Scraping error: {str(e)}")
        return None

def main():
    # Example URLs - you can add multiple URLs
    urls = [
        "https://www.flipkart.com/bevzilla-75-grams-x-4-flavoured-instant-coffee-powder-strong/p/itmc7fd3d9d04440",
        "https://www.flipkart.com/msi-sword-16-hx-intel-core-i7-14th-gen-14700hx-16-gb-1-tb-ssd-windows-11-home-8-gb-graphics-nvidia-geforce-rtx-4060-144-hz-b14vfkg-208in-gaming-laptop/p/itm786c75fc85f48?pid=COMGYSGNTQ4QPZYZ&lid=LSTCOMGYSGNTQ4QPZYZFT0IKB&marketplace=FLIPKART&q=msi+katana+17&store=6bo%2Fb5g&srno=s_1_1&otracker=AS_QueryStore_OrganicAutoSuggest_1_6_na_na_na&otracker1=AS_QueryStore_OrganicAutoSuggest_1_6_na_na_na&fm=organic&iid=en_ZkjMs0F8XEDxqtxcVsakyi3C-C_wSg38a2Jd4DZ2MhXqkJyJ9oaN3vbu4rXySmH5oyedtkgbi1lTtm3qPLO3gPUFjCTyOHoHZs-Z5_PS_w0%3D&ppt=pp&ppn=pp&ssid=souzozweb40000001736472548572&qH=0502d2123e99b533",
    ]
    print(f"Starting scraping for URLs: {urls}")
    
    extracted_content = scrape_with_playwright(urls, schema=schema)
    
    if extracted_content:
        print("\nSuccessfully extracted content:")
        pprint.pprint(extracted_content)
        
        # Save to JSON file
        save_to_json(extracted_content)
    else:
        print("\nNo content was extracted")
    
    return extracted_content
