import requests
from bs4 import BeautifulSoup
import logging

logging.basicConfig(level=logging.INFO)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
}
def get_products():
    url = "https://www.amazon.com/s?k=python+books"
    response = requests.get(url, headers=headers)
    print(response)
    if response.status_code != 200:
        logging.error(f"Failed to retrieve the webpage. Status code: {response.status_code}")
        return ["error"]
    soup = BeautifulSoup(response.content, "html.parser")
    products = []
    for item in soup.select(".s-main-slot .s-result-item"):
        title = item.select_one("h2 .a-link-normal").text.strip() if item.select_one("h2 .a-link-normal") else "No Title"
        price = item.select_one(".a-price-whole").text.strip() if item.select_one(".a-price-whole") else "No Price"
        rating = item.select_one(".a-icon-alt").text.strip() if item.select_one(".a-icon-alt") else "No Rating"
        products.append({
            "title": title,
            "price": price,
            "rating": rating
        })
    return products
