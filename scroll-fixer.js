function guessElement(point) {
  // Find the fixed/sticky element closest to the root
  let resultEl = null;
  let sampledEl = document.elementFromPoint(...point);
  while (sampledEl) {
    const styles = window.getComputedStyle(sampledEl);
    const position = styles.getPropertyValue('position');
    if (position === 'fixed' || position === 'sticky') {
      resultEl = sampledEl;
    }
    sampledEl = sampledEl.parentElement;
  }

  return resultEl;
}

// The element might only be partially visible due to things like relative
// positioning or translateY's.
function getVisibleHeaderHeight() {
  const point = [window.innerWidth / 3, 10];

  const element = guessElement(point);
  if (!element) return 0;

  const { bottom } = element.getBoundingClientRect();
  return bottom;
}

function getVisibleFooterHeight() {
  const point = [window.innerWidth / 3, window.innerHeight - 10];

  const element = guessElement(point);
  if (!element) return 0;

  const { top } = element.getBoundingClientRect();
  return window.innerHeight - top;
}

function onKeyDown(event) {
  const { key, metaKey, ctrlKey, shiftKey } = event;
  const isPagingDown = key === ' ' || key === 'PageDown';
  const isPagingUp = (key === ' ' && shiftKey) || key === 'PageUp';

  if (ctrlKey || metaKey || (!isPagingDown && !isPagingUp)) return;

  const headerHeight = getVisibleHeaderHeight();
  const footerHeight = getVisibleFooterHeight();

  if (!headerHeight && !footerHeight) return;

  event.preventDefault();

  // TODO: make this adjustable
  const wiggle = 10;

  const amountToScroll =
    window.innerHeight - headerHeight - footerHeight - wiggle;

  window.scrollBy({
    left: 0,
    top: isPagingUp ? -amountToScroll : amountToScroll,
    behavior: 'smooth',
  });
}

function attach() {
  window.addEventListener('keydown', onKeyDown, { useCapture: true });
}

function detach() {
  window.removeEventListener('keydown', onKeyDown, { useCapture: true });
}

chrome.storage.sync.get(['isEnabled'], ({ isEnabled }) => {
  if (isEnabled) attach();
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  const isEnabledChange = changes.isEnabled;
  if (isEnabledChange) {
    detach();
    if (isEnabledChange.newValue) attach();
  }
});
