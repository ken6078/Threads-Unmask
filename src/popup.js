const { DEFAULT_SETTINGS, localizeDocument } = globalThis.ThreadsUnmaskCore;

const textCheckbox = document.querySelector("#remove-text-spoilers");
const imageCheckbox = document.querySelector("#remove-image-spoilers");
const openOptionsButton = document.querySelector("#open-options");
const status = document.querySelector("#status");
let uiText = localizeDocument(document, DEFAULT_SETTINGS.uiLanguage, "popup");

function showStatus(message) {
  status.textContent = message;
  window.clearTimeout(showStatus.timerId);
  showStatus.timerId = window.setTimeout(() => {
    status.textContent = "";
  }, 1400);
}

function saveSettings() {
  chrome.storage.sync.set(
    {
      removeTextSpoilers: textCheckbox.checked,
      removeImageSpoilers: imageCheckbox.checked
    },
    () => {
      showStatus(uiText.statusSaved);
    }
  );
}

chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
  textCheckbox.checked = Boolean(stored.removeTextSpoilers);
  imageCheckbox.checked = Boolean(stored.removeImageSpoilers);
  uiText = localizeDocument(document, stored.uiLanguage || DEFAULT_SETTINGS.uiLanguage, "popup");
});

textCheckbox.addEventListener("change", saveSettings);
imageCheckbox.addEventListener("change", saveSettings);
openOptionsButton.addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
