document.getElementById("scrapeMetadata").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: scrapeMetadataFromPage,
        },
        (results) => {
            if (results && results[0] && results[0].result) {
                processInsights(results[0].result);
            } else {
                document.getElementById("output").textContent = "No metadata or insights found.";
            }
        }
    );
});

function processInsights(metadata) {
    const output = document.getElementById("output");

    if (metadata.productInsights && metadata.productInsights !== "N/A") {
        // Extract meaningful insights from the raw text
        const insights = metadata.productInsights
            .split("\n")
            .map((line) => line.trim()) // Remove extra spaces
            .filter((line) => line.length > 0 && !line.toLowerCase().includes("ai-generated")); // Remove unwanted lines

        // Structure the insights for better readability
        const cleanedMetadata = {
            title: metadata.title,
            description: metadata.description,
            keywords: metadata.keywords,
            url: metadata.url,
            insights: insights,
        };

        // Display the cleaned metadata
        output.textContent = JSON.stringify(cleanedMetadata, null, 2);
    } else {
        output.textContent = "No meaningful insights found.";
    }
}

function scrapeMetadataFromPage() {
    try {
        return {
            title: document.title || "N/A",
            description: document.querySelector('meta[name="description"]')?.content || "N/A",
            keywords: document.querySelector('meta[name="keywords"]')?.content || "N/A",
            url: window.location.href || "N/A",
            productInsights: document.getElementById("cr-product-insights-cards")?.innerText || "N/A",
        };
    } catch (error) {
        console.error("Error scraping metadata:", error);
        return null;
    }
}
