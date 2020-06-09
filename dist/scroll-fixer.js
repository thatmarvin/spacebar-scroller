"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function guessElement(point) {
  var _document;

  // Find the fixed/sticky element closest to the root
  var resultEl = null;

  var sampledEl = (_document = document).elementFromPoint.apply(_document, _toConsumableArray(point));

  while (sampledEl) {
    var styles = window.getComputedStyle(sampledEl);
    var position = styles.getPropertyValue('position');

    if (position === 'fixed' || position === 'sticky') {
      resultEl = sampledEl;
    }

    sampledEl = sampledEl.parentElement;
  }

  return resultEl;
} // The element might only be partially visible due to things like relative
// positioning or translateY's.


function getVisibleHeaderHeight() {
  var point = [window.innerWidth / 3, 10];
  var element = guessElement(point);
  if (!element) return 0;

  var _element$getBoundingC = element.getBoundingClientRect(),
      bottom = _element$getBoundingC.bottom;

  return bottom;
}

function getVisibleFooterHeight() {
  var point = [window.innerWidth / 3, window.innerHeight - 10];
  var element = guessElement(point);
  if (!element) return 0;

  var _element$getBoundingC2 = element.getBoundingClientRect(),
      top = _element$getBoundingC2.top;

  return window.innerHeight - top;
}

function onKeyDown(event) {
  var key = event.key,
      metaKey = event.metaKey,
      ctrlKey = event.ctrlKey,
      shiftKey = event.shiftKey,
      target = event.target;
  var element = target;
  var isTextField = element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA' || element.hasAttribute('contenteditable');
  var isPagingDown = key === ' ' || key === 'PageDown';
  var isPagingUp = key === ' ' && shiftKey || key === 'PageUp';
  if (ctrlKey || metaKey || !isPagingDown && !isPagingUp || isTextField) return;
  var headerHeight = getVisibleHeaderHeight();
  var footerHeight = getVisibleFooterHeight();
  if (!headerHeight && !footerHeight) return;
  event.preventDefault(); // TODO: make this adjustable

  var wiggle = 10;
  var amountToScroll = window.innerHeight - headerHeight - footerHeight - wiggle;
  window.scrollBy({
    left: 0,
    top: isPagingUp ? -amountToScroll : amountToScroll,
    behavior: 'smooth'
  });
}

var excludeList = ['youtube.com'];

function attach() {
  if (excludeList.some(function (match) {
    return location.hostname.includes(match);
  })) return;
  window.addEventListener('keydown', onKeyDown);
}

function detach() {
  window.removeEventListener('keydown', onKeyDown);
}

chrome.storage.sync.get(['isEnabled'], function (_ref) {
  var isEnabled = _ref.isEnabled;
  if (isEnabled) attach();
});
chrome.storage.onChanged.addListener(function (changes, namespace) {
  var isEnabledChange = changes.isEnabled;

  if (isEnabledChange) {
    detach();
    if (isEnabledChange.newValue) attach();
  }
});