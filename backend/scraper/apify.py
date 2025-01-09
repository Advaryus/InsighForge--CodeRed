from apify_client import ApifyClient
from flask import Flask, request, jsonify
# Initialize the ApifyClient with your API token
client = ApifyClient("apify_api_JXZgyukI5CjqjruDKbkxvFnuapVWq72j8daV")
app = Flask(__name__)
@app.route('/api/apify', methods=['GET'])
# Prepare the Actor input
def apify():
    run_input = {
        "productUrls": [{ "url": "https://www.amazon.com/dp/B0CWXNS552" }],
        "maxReviews": 100,
        "sort": "helpful",
        "includeGdprSensitive": False,
        "filterByRatings": ["allStars"],
        "reviewsUseProductVariantFilter": False,
        "reviewsEnqueueProductVariants": False,
        "proxyCountry": "AUTO_SELECT_PROXY_COUNTRY",
        "scrapeProductDetails": False,
        "reviewsAlwaysSaveCategoryData": False,
        "scrapeQuickProductReviews": True,
    }

    # Run the Actor and wait for it to finish
    run = client.actor("R8WeJwLuzLZ6g4Bkk").call(run_input=run_input)
    items=[]
    # Fetch and print Actor results from the run's dataset (if there are any)
    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        items.append(item)
    return items

if __name__ == '__main__':
    app.run(debug=True)