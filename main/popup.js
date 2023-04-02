document.getElementById('capture').addEventListener('click', () => {
  chrome.runtime.sendMessage({action: 'captureText'}, (response) => {
    document.getElementById('recognizedText').value = response.recognizedText;
  });
});
