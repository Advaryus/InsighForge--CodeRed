import selenium.webdriver as webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup

def scrape_website(website):
    print(f"Scraping {website}")
    # chrome_driver_path = "./chromedriver.exe"
    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(options=options)

    try:
        driver.get(website)
        print("page loaded")
        html = driver.page_source
        return html
    finally:
        driver.quit()

def extract_body(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    body_content = soup.body
    if body_content:
        return str(body_content)
    return "Not found"

def extract_meta(html_content):
    options = webdriver.ChromeOptions()
    driver = webdriver.Chrome(options=options)
    soup = BeautifulSoup(html_content, 'html.parser')
    try:
        meta_keywords_tag = soup.find('meta', attrs={'name': 'keywords'})
        if not meta_keywords_tag:
            meta_keywords_tag = soup.find('meta', attrs={'name': 'Keywords'})
        meta_keywords = meta_keywords_tag.get('content') if meta_keywords_tag else None
        meta_description_tag = soup.find('meta', attrs={'name': 'description'})
        meta_description = meta_description_tag.get('content') if meta_description_tag else None
        return {"keywords": meta_keywords, "description": meta_description}
    except:
        return {"keywords": "None", "description": "None"}
    finally:
        driver.quit()

def clean_body(body_content):
    soup = BeautifulSoup(body_content, 'html.parser')
    for script in soup(["script", "style"]):
        script.extract()
    clean_content = soup.get_text(separator="\n")
    cleaned_content = "\n".join(line.strip() for line in clean_content.splitlines() if line.strip())

    return cleaned_content

def split_dom_content(dom_content, max_length=6000):
    return [
        dom_content[i:i + max_length]
        for i in range(0, len(dom_content), max_length)
    ]

def extract_reviews(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    # reviews_div = soup.find('div', class_='_8-rIO3')
    # return reviews_div
    #  if reviews_div:
    #      reviews = reviews_div.find_all('div', class_='')
    #      return [review.get_text(strip=True) for review in reviews]
    #  return []
    reviews_divs = soup.find_all('div', class_='EPCmJX')
    print(reviews_divs)
    return [div.get_text(strip=True) for div in reviews_divs]
