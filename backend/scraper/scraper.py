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