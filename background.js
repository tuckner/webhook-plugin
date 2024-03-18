chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    "id": "sendToWebhook",
    "title": "Send page to webhook",
    "contexts": ["page", "selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "sendToWebhook") {
    // Get the 'webhookUrl' from settings
    chrome.storage.sync.get(['webhookUrl'], function(data) {
      if (data.webhookUrl) {
        // Determine whether to send selected text or whole page
        if (info.selectionText) {
          // User has selected text; send the selection
          sendWebhookRequest(data.webhookUrl, {
            url: info.pageUrl,
            contents: info.selectionText
          });
        } else {
          // No text selected; send the whole page content
          chrome.scripting.executeScript({
            target: {tabId: tab.id},
            function: getPageContent
          }, (injectionResults) => {
            if (injectionResults && injectionResults[0]) {
              sendWebhookRequest(data.webhookUrl, {
                url: info.pageUrl,
                contents: injectionResults[0].result
              });
            }
          });
        }
      } else {
        console.error('Webhook URL is not defined.');
      }
    });
  }
});

// Function to get the page content
function getPageContent() {
  return document.documentElement.outerHTML;
}

// Function to send the data to the webhook
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