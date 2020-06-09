"use strict";

var checkbox = document.getElementById('enabled');
chrome.storage.sync.get('isEnabled', function (_ref) {
  var isEnabled = _ref.isEnabled;
  checkbox.checked = !!isEnabled;
});
checkbox.addEventListener('change', function (event) {
  var isEnabled = Number(checkbox.checked);
  chrome.storage.sync.set({
    isEnabled: isEnabled
  }, function () {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        isEnabled: isEnabled
      });
    });
  });
});