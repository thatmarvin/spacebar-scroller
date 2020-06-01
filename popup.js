const checkbox = document.getElementById('enabled');

chrome.storage.sync.get('isEnabled', ({ isEnabled }) => {
  checkbox.checked = !!isEnabled;
});

checkbox.addEventListener('change', (event) => {
  let isEnabled = Number(event.target.checked);

  chrome.storage.sync.set({ isEnabled }, function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { isEnabled });
    });
  });
});
