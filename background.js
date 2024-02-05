chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    "id": "sendToWebhook",
    "title": "Send page to webhook",
    "contexts": ["page"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "sendToWebhook") {
    // First, get the 'sendBody' setting value
    chrome.storage.sync.get(['webhookUrl', 'sendBody'], function(data) {
      if (data.webhookUrl) {
        let body = { url: info.pageUrl };

        // Check if 'sendBody' is true
        if (data.sendBody) {
          // Execute the content script to get the page's HTML content
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: getPageContent
          }, (injectionResults) => {
            if (injectionResults && injectionResults[0]) {
              body.contents = injectionResults[0].result;
            }
            // Send the body to the webhook
            sendWebhookRequest(data.webhookUrl, body);
          });
        } else {
          // If 'sendBody' is not true, send only the URL
          sendWebhookRequest(data.webhookUrl, body);
        }
      } else {
        console.error('Webhook URL is not defined.');
      }
    });
  }
});

// This function will be injected into the page to retrieve the page content
function getPageContent() {
  return document.documentElement.outerHTML;
}

// This function sends the data to the webhook
function sendWebhookRequest(webhookUrl, body) {
  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(response => response.json())
  .then(responseData => {
    console.log('Webhook response:', responseData);
  })
  .catch(error => {
    console.error('Error sending webhook:', error);
  });
}