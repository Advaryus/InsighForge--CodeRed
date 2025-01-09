document.getElementById("scrapeMetadata").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: scrapeMetadataFromPage,
        },
        (results) => {
            if (results && results[0] && results[0].result) {
                displayMetadata(results[0].result);
            } else {
                document.getElementById("output").textContent = "No metadata found or error occurred.";
            }
        }
    );
});

function displayMetadata(metadata) {
    const output = document.getElementById("output");
    output.textContent = JSON.stringify(metadata, null, 2);
}

function scrapeMetadataFromPage() {
    try {
        return {
            title: document.title || "N/A",
            description: document.querySelector('meta[name="description"]')?.content || "N/A",
            keywords: document.querySelector('meta[name="keywords"]')?.content || "N/A",
            url: window.location.href || "N/A"
        };
    } catch (error) {
        console.error("Error scraping metadata:", error);
        return null;
    }
}
