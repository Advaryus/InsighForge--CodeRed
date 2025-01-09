let scrapedData = null; // Variable to store scraped metadata

document.getElementById("scrapeMetadata").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: scrapeMetadataFromPage,
        },
        (results) => {
            if (results && results[0] && results[0].result) {
                scrapedData = results[0].result; // Store the scraped data
                displayMetadata(scrapedData);
            } else {
                document.getElementById("output").textContent = "No metadata or insights found.";
            }
        }
    );
});

document.getElementById("sendMetadata").addEventListener("click", async () => {
    if (!scrapedData) {
        document.getElementById("output").textContent = "Please scrape metadata first.";
        return;
    }

    const response = await sendMetadataToServer({ productInsights: scrapedData.productInsights }, {url: scrapedData.url});
    if (response.ok) {
        document.getElementById("output").textContent = "Metadata sent successfully!";
    } else {
        document.getElementById("output").textContent = "Failed to send metadata.";
    }
});

document.getElementById("sendUrl").addEventListener("click", async () => {
    const urlElements = document.querySelectorAll("#url");
    const urls = Array.from(urlElements).map(el => el.value).filter(url => url);

    if (urls.length === 0) {
        document.getElementById("output").textContent = "Please enter URLs.";
        return;
    }

    const response = await sendUrlToServer({ urls });
    if (response.ok) {
        document.getElementById("output").textContent = "URLs sent successfully!";
    } else {
        document.getElementById("output").textContent = "Failed to send URLs.";
    }
});

function displayMetadata(metadata) {
    document.getElementById("description").textContent = metadata.description;
    document.getElementById("keywords").textContent = metadata.keywords;
    document.getElementById("title").textContent = metadata.title;
    const urlElement = document.getElementById("url");
    urlElement.textContent = metadata.url;
    urlElement.href = metadata.url;
    document.getElementById("metadata").style.display = "block";

}

function scrapeMetadataFromPage() {
    try {
        return {
            title: document.title || "N/A",
            description: document.querySelector('meta[name="description"]')?.content || "N/A",
            keywords: Array.from(document.getElementsByClassName('a-section a-spacing-small a-spacing-top-small _Y3Itc_aspect-symbol-list_24amT')).map(el => el.textContent).join(", ") || "N/A",
            productInsights: document.getElementById("cr-product-insights-cards")?.innerText || "N/A",
        };
    } catch (error) {
        console.error("Error scraping metadata:", error);
        return null;
    }
}

async function sendMetadataToServer(metadata) {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/process_and_answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(metadata),
        });
        return response;
    } catch (error) {
        console.error("Error sending metadata to server:", error);
        return { ok: false };
    }
}

async function sendUrlToServer(data) {
    try {
        const response = await fetch("http://127.0.0.1:5000/api/processcomp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error("Error sending URL to server:", error);
        return { ok: false };
    }
}
