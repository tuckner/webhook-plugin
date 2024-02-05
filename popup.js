document.addEventListener('DOMContentLoaded', function() {
  var inputBox = document.getElementById('inputBox');
  var inputCheckbox = document.getElementById('inputCheckbox');

  // Retrieve and display the values
  chrome.storage.sync.get(['webhookUrl', 'sendBody'], function(data) {
      if (data.webhookUrl) {
          inputBox.value = data.webhookUrl;
      } else {
          console.log('No stored webhook URL found.');
      }
      if (data.hasOwnProperty('sendBody')) { // Check if 'sendBody' key exists
          inputCheckbox.checked = data.sendBody;
      } else {
          console.log('No stored checkbox value found.');
      }
  });

  // Save the values when the submit button is clicked
  document.getElementById('submitButton').addEventListener('click', function() {
    var webhookUrl = inputBox.value;
    var sendBody = inputCheckbox.checked;
    
    chrome.storage.sync.set({ 'webhookUrl': webhookUrl, 'sendBody': sendBody }, function() {
        // Change the button text to 'Saved'
        var button = document.getElementById('submitButton');
        button.textContent = 'Saved';
        button.style.backgroundColor = 'blue';
        button.disabled = true; // Optional: Disable the button
        
        // Optionally, change the button back after some time
        setTimeout(function() {
            button.textContent = 'Save';
            button.style.backgroundColor = ''; // Remove the inline style to revert to the original
            button.disabled = false; // Optional: Re-enable the button
        }, 1000); // Change the text back after 2 seconds
    });
  });
});

