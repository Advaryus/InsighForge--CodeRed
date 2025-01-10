chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.metadata) {
        console.log("Metadata received:", message.metadata);
    }
});
