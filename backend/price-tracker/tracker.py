import requests
from bs4 import BeautifulSoup
import json  # Import json module

def fetch_product_data(product_url):
    # Set headers to mimic a browser request
    headers = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6",
        "Referer": "https://pricehistory.app/amazon-price-tracker"
    }

    # Send a GET request
    response = requests.get(product_url, headers=headers)

    # Check if the response is successful
    if response.status_code == 200:
        # Decode the content if compressed
        if response.headers.get('Content-Encoding') == 'br':
            import brotli
            try:
                html_content = brotli.decompress(response.content).decode('utf-8')
            except brotli.error as e:
                print(f"Brotli decompression failed: {e}")
                # Fallback to using the response text directly
                html_content = response.text
        elif response.headers.get('Content-Encoding') in ['gzip', 'deflate']:
            html_content = response.content.decode('utf-8')
        else:
            html_content = response.text

        # Parse the HTML content
        soup = BeautifulSoup(html_content, "html.parser")

        # Extract specific data (modify based on your target elements)
        try:
            product_name = soup.find("h1", class_="mb-0").text.strip()  # Assuming product name is in an <h1> tag
            lowest_price = int(soup.find("td", class_="pb-0 h5 text-info").text.strip().replace(',', '').replace('₹', ''))  # Adjust class as necessary
            average_price = int(soup.find("td", class_="pb-0 h5 text-warning").text.strip().replace(',', '').replace('₹', ''))  # Example for highest price
            highest_price = int(soup.find("td", class_="pb-0 h5 text-danger").text.strip().replace(',', '').replace('₹', ''))  # Example for lowest price
            product_details = soup.find(id="product-details").text.strip()  # Fetching product details by id

            product_data = {
                "Product Name": product_name,
                "Average Price": average_price,
                "Highest Price": highest_price,
                "Lowest Price": lowest_price,
                "Product Details": product_details  # Adding product details to the returned data
            }

            # Save the data to a JSON file
            with open('product_info.json', 'w') as json_file:
                json.dump(product_data, json_file, indent=4)

            return product_data
        except AttributeError:
            print("Failed to extract one or more elements. Check the HTML structure.")
            return None
    else:
        print(f"Failed to fetch the webpage. Status code: {response.status_code}")
        return None

# Example usage
product_url = "https://pricehistory.app/p/tata-salt-1-kg-free-flowing-iodised-Y11mArIm"
product_data = fetch_product_data(product_url)
if product_data:
    for key, value in product_data.items():
        print(f"{key}: {value}")
