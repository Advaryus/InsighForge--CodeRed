
# chat_model.py
import json
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from langchain_groq import ChatGroq
from langchain_core.tools import tool
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv(dotenv_path="../.env.local")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
print(f"Loaded GROQ API Key: {GROQ_API_KEY}")
# Initialize the LLM
llm = ChatGroq(
    model="llama-3.2-90b-vision-preview",
    temperature=0.2,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    api_key=GROQ_API_KEY
)

memory = MemorySaver()

@tool
def analyze_product(website_data: str) -> dict:
    """
    Analyzes scraped website data and returns product insights.
    Args:
        website_data (str): HTML content from scraped website
    Returns:
        dict: Analysis results
    """
    # Extract basic product information from the website data
    # This is a simplified example - you might want to add more sophisticated parsing
    analysis = {
        "product_name": "Extracted Product",
        "features": [],
        "user_needs": [],
        "suggested_improvements": []
    }
    
    # Simple keyword-based feature extraction
    if "features" in website_data.lower():
        analysis["features"] = ["Feature detected in content"]
    
    return analysis

tools = [analyze_product]
graph = create_react_agent(llm, tools, checkpointer=memory)

def extract_insights(prompt: str, website_data: str) -> dict:
    """
    Extracts insights using LLM based on user prompt and website data.
    """
    system_prompt = """You are a product analyst AI. Analyze the website data and respond to the user's prompt.
    Provide specific, actionable insights about the product. Format your response as JSON with the following structure:
    {
        "main_insights": [list of key findings],
        "market_opportunity": [potential opportunities],
        "risks": [potential risks or challenges]
    }
    """
    
    user_message = f"""
    Website Content:
    {website_data[:1000]}  # Truncating to avoid token limits
    
    User Question:
    {prompt}
    
    Provide structured insights about this product/website.
    """
    
    response = llm.invoke(system_prompt + "\n" + user_message)
    
    try:
        return json.loads(response.content)
    except json.JSONDecodeError:
        # Fallback if response isn't valid JSON
        return {
            "main_insights": [response.content],
            "market_opportunity": [],
            "risks": []
        }

def ProductInsightsModel(user_prompt: str, website_data: str) -> dict:
    """
    Main function to analyze website data and generate insights.
    """
    try:
        # Get basic product analysis
        product_info = analyze_product(website_data)
        
        # Get LLM-based insights
        llm_insights = extract_insights(user_prompt, website_data)
        
        return {
            "status": "success",
            "product_analysis": product_info,
            "llm_insights": llm_insights
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

# CLI testing functionality
if __name__ == "__main__":
    # Test data
    sample_website_data = """
    Our revolutionary product helps businesses streamline their operations.
    Key features include:
    - Automated workflow management
    - Real-time analytics
    - Team collaboration tools
    
    Perfect for small to medium-sized businesses looking to improve efficiency.
    """
    
    sample_prompt = "What are the main benefits and target market for this product?"
    
    # Run analysis
    results = ProductInsightsModel(sample_prompt, sample_website_data)
    
    # Pretty print results
    print("\n=== Product Analysis Results ===")
    print(json.dumps(results, indent=2))
