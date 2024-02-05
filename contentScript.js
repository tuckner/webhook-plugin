chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.method === "getHTML") {
      sendResponse({html: document.documentElement.outerHTML});
    }
  }
);