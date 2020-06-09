const checkbox = document.getElementById('enabled') as HTMLInputElement;

chrome.storage.sync.get('isEnabled', ({ isEnabled }) => {
  checkbox!.checked = !!isEnabled;
});

checkbox.addEventListener('change', (event) => {
  let isEnabled = Number(checkbox.checked);

  chrome.storage.sync.set({ isEnabled }, function () {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id as number, { isEnabled });
    });
  });
});
