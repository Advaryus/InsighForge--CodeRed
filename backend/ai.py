import json
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
from langchain_groq import ChatGroq
from langchain_core.tools import tool
from dotenv import load_dotenv
import os
load_dotenv(dotenv_path='../../.env.local')
API_KEY = os.getenv('GROQ_API_KEY')

llm = ChatGroq(
    model="your-model",
    temperature=0.2,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    api_key="API_KEY"
)

memory = MemorySaver()

@tool
def analyze_product(website_data: str) -> dict:
    """
    Analyzes scraped website data and returns product insights.
    """
    # Basic placeholder analysis
    return {
        "product_name": "Example Product",
        "features": ["Feature A", "Feature B", "Feature C"],
        "user_needs": ["Need 1", "Need 2"],
        "suggested_improvements": ["Improvement 1", "Improvement 2"]
    }

tools = [analyze_product]

graph = create_react_agent(llm, tools, checkpointer=memory)

def extract_insights(prompt, website_data):
    """
    Extracts high-level insights based on user prompt and website data.
    """
    # Use LLM or custom logic to process data
    response = llm.invoke(f"""
    Based on the website data below and the user prompt, 
    provide key insights about the product:

    Website Data:
    {website_data}

    User Prompt:
    {prompt}
    """)
    try:
        return json.loads(response.content)
    except:
        return {"insights": response.content}

def ProductInsightsModel(user_prompt, website_data):
    """
    Calls the analysis tools and returns combined insights.
    """
    # Tool usage
    product_info = analyze_product(website_data)
    # LLM-based analysis
    additional_info = extract_insights(user_prompt, website_data)

    return {
        "res": {
            "msg": "Analysis complete.",
            "status": "success"
        },
        "productInsights": product_info,
        "llmInsights": additional_info
    }
