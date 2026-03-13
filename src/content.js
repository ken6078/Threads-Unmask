const {
  DEFAULT_SETTINGS,
  hasSpoilerBackground,
  shouldHandleTextSpoilers,
  shouldHandleImageSpoilers,
  hasSpoilerLabelText
} = globalThis.ThreadsUnmaskCore;

let settings = { ...DEFAULT_SETTINGS };
let scheduled = false;
const PROCESSED_ATTR = "data-threads-unmask-processed";
const CLICKED_IMAGE_ATTR = "data-threads-unmask-image-clicked";

function isVisible(element) {
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    rect.width > 0 &&
    rect.height > 0
  );
}

function clearTextSpoiler(root) {
  const elements = [root, ...root.querySelectorAll("*")];

  for (const element of elements) {
    if (!(element instanceof HTMLElement)) {
      continue;
    }

    const style = window.getComputedStyle(element);
    element.style.setProperty("filter", "none", "important");
    element.style.setProperty("backdrop-filter", "none", "important");
    element.style.setProperty("-webkit-backdrop-filter", "none", "important");
    element.style.setProperty("-webkit-text-fill-color", "inherit", "important");
    element.style.setProperty("color", "inherit", "important");
    element.style.setProperty("mask", "none", "important");
    element.style.setProperty("-webkit-mask", "none", "important");
    element.style.setProperty("clip-path", "none", "important");
    element.style.setProperty("opacity", "1", "important");
    element.style.setProperty("visibility", "visible", "important");
    element.style.setProperty("mix-blend-mode", "normal", "important");

    if (hasSpoilerBackground(element)) {
      element.style.setProperty("background-color", "transparent", "important");
      element.style.setProperty("background-image", "none", "important");
      element.style.setProperty("pointer-events", "none", "important");
      continue;
    }

    if (
      style.filter.includes("blur") ||
      style.backdropFilter.includes("blur") ||
      style.webkitTextFillColor === "rgba(0, 0, 0, 0)" ||
      style.color === "rgba(0, 0, 0, 0)"
    ) {
      element.style.setProperty("background-color", "transparent", "important");
    }
  }
}

function unwrapSpoilerElement(element) {
  if (!(element instanceof HTMLElement) || element.hasAttribute(PROCESSED_ATTR)) {
    return;
  }

  clearTextSpoiler(element);
  element.setAttribute(PROCESSED_ATTR, "true");

  if (!element.parentNode || element.childNodes.length === 0) {
    return;
  }

  const fragment = document.createDocumentFragment();
  while (element.firstChild) {
    fragment.appendChild(element.firstChild);
  }

  element.parentNode.insertBefore(fragment, element);
  element.remove();
}

function isFlattenableWrapper(element) {
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  if (element.tagName !== "DIV" && element.tagName !== "SPAN") {
    return false;
  }

  if (element.attributes.length > 1) {
    return false;
  }

  if (element.attributes.length === 1 && element.attributes[0].name !== PROCESSED_ATTR) {
    return false;
  }

  const meaningfulChildren = Array.from(element.childNodes).filter((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent.trim().length > 0;
    }

    return node.nodeType === Node.ELEMENT_NODE;
  });

  if (meaningfulChildren.length !== 1) {
    return false;
  }

  return meaningfulChildren[0] instanceof HTMLElement;
}

function flattenNestedWrappers(startNode) {
  let current = startNode;

  while (isFlattenableWrapper(current)) {
    const child = Array.from(current.childNodes).find((node) => node.nodeType === Node.ELEMENT_NODE);
    if (!(child instanceof HTMLElement) || !current.parentNode) {
      break;
    }

    current.parentNode.insertBefore(child, current);
    current.remove();
    current = child;
  }
}

function findImageSpoilerWrapper(label) {
  const button = label.closest('[role="button"]');
  if (!(button instanceof HTMLElement)) {
    return null;
  }

  const outerWrapper = button.parentElement;
  if (!(outerWrapper instanceof HTMLElement)) {
    return null;
  }

  const secondLayer = outerWrapper.parentElement;
  if (!(secondLayer instanceof HTMLElement)) {
    return null;
  }

  const host = secondLayer.parentElement;
  if (!(host instanceof HTMLElement)) {
    return null;
  }

  if (!button.querySelector("img, picture")) {
    return null;
  }

  if (host.firstElementChild !== secondLayer) {
    return null;
  }

  return secondLayer;
}

function findImageSpoilerButton(label) {
  const button = label.closest('[role="button"]');
  if (!(button instanceof HTMLElement)) {
    return null;
  }

  if (!button.querySelector("img, picture")) {
    return null;
  }

  return button;
}

function triggerSpoilerClick(button) {
  if (!(button instanceof HTMLElement)) {
    return;
  }

  const rect = button.getBoundingClientRect();
  const eventInit = {
    bubbles: true,
    cancelable: true,
    composed: true,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
    button: 0,
    buttons: 1
  };

  const pointerEventNames = ["pointerdown", "pointerup"];
  for (const eventName of pointerEventNames) {
    button.dispatchEvent(new PointerEvent(eventName, { ...eventInit, pointerId: 1, pointerType: "mouse", isPrimary: true }));
  }

  const mouseEventNames = ["mousedown", "mouseup", "click"];
  for (const eventName of mouseEventNames) {
    button.dispatchEvent(new MouseEvent(eventName, eventInit));
  }

  button.click();
}

function unwrapElementIntoParent(element) {
  if (!(element instanceof HTMLElement) || !element.parentNode) {
    return;
  }

  const parent = element.parentNode;
  const fragment = document.createDocumentFragment();

  while (element.firstChild) {
    const child = element.firstChild;
    if (child instanceof HTMLElement) {
      clearTextSpoiler(child);
    }
    fragment.appendChild(child);
  }

  parent.insertBefore(fragment, element);
  element.remove();
}

function processImageSpoilerLabel(element) {
  if (!(element instanceof HTMLElement) || !isVisible(element)) {
    return;
  }

  if (!shouldHandleImageSpoilers(settings)) {
    return;
  }

  if (!hasSpoilerLabelText(element)) {
    return;
  }

  const button = findImageSpoilerButton(element);
  if (!button) {
    return;
  }

  if (!button.hasAttribute(CLICKED_IMAGE_ATTR)) {
    button.setAttribute(CLICKED_IMAGE_ATTR, "true");
    triggerSpoilerClick(button);

    window.setTimeout(() => {
      if (!document.contains(button)) {
        return;
      }

      if (!button.querySelector("span") || !Array.from(button.querySelectorAll("span")).some(hasSpoilerLabelText)) {
        scheduleScan();
        return;
      }

      const fallbackWrapper = findImageSpoilerWrapper(element);
      if (fallbackWrapper) {
        unwrapElementIntoParent(fallbackWrapper);
      }
    }, 150);

    return;
  }

  const wrapper = findImageSpoilerWrapper(element);
  if (wrapper) {
    unwrapElementIntoParent(wrapper);
  }
}

function processCandidate(element) {
  if (!(element instanceof HTMLElement) || !isVisible(element)) {
    return;
  }

  if (!hasSpoilerBackground(element)) {
    return;
  }

  if (!shouldHandleTextSpoilers(settings)) {
    return;
  }

  const parent = element.parentNode;
  unwrapSpoilerElement(element);

  if (!(parent instanceof HTMLElement)) {
    return;
  }

  for (const child of Array.from(parent.children)) {
    flattenNestedWrappers(child);
  }
}

function scanPage() {
  scheduled = false;

  const selector = ["span", "div"].join(", ");

  for (const element of document.querySelectorAll(selector)) {
    processCandidate(element);
  }

  for (const element of document.querySelectorAll("span")) {
    processImageSpoilerLabel(element);
  }
}

function scheduleScan() {
  if (scheduled) {
    return;
  }

  scheduled = true;
  window.requestAnimationFrame(scanPage);
}

function watchPage() {
  const observer = new MutationObserver(() => {
    scheduleScan();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style", "aria-label", "title"]
  });
}

function loadSettings() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    settings = {
      removeTextSpoilers: Boolean(stored.removeTextSpoilers),
      removeImageSpoilers: Boolean(stored.removeImageSpoilers)
    };

    scheduleScan();
  });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== "sync") {
    return;
  }

  if (changes.removeTextSpoilers) {
    settings.removeTextSpoilers = Boolean(changes.removeTextSpoilers.newValue);
  }

  if (changes.removeImageSpoilers) {
    settings.removeImageSpoilers = Boolean(changes.removeImageSpoilers.newValue);
  }

  scheduleScan();
});

loadSettings();
watchPage();
scheduleScan();
