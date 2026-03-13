const { DEFAULT_SETTINGS, localizeDocument } = globalThis.ThreadsUnmaskCore;

const textCheckbox = document.querySelector("#remove-text-spoilers");
const imageCheckbox = document.querySelector("#remove-image-spoilers");
const languageSelect = document.querySelector("#ui-language");
const status = document.querySelector("#status");
let uiText = localizeDocument(document, DEFAULT_SETTINGS.uiLanguage, "options");

function showStatus(message) {
  status.textContent = message;
  window.clearTimeout(showStatus.timerId);
  showStatus.timerId = window.setTimeout(() => {
    status.textContent = "";
  }, 1800);
}

function saveSettings() {
  chrome.storage.sync.set(
    {
      removeTextSpoilers: textCheckbox.checked,
      removeImageSpoilers: imageCheckbox.checked,
      uiLanguage: languageSelect.value
    },
    () => {
      uiText = localizeDocument(document, languageSelect.value, "options");
      showStatus(uiText.statusSaved);
    }
  );
}

chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
  textCheckbox.checked = Boolean(stored.removeTextSpoilers);
  imageCheckbox.checked = Boolean(stored.removeImageSpoilers);
  languageSelect.value = stored.uiLanguage || DEFAULT_SETTINGS.uiLanguage;
  uiText = localizeDocument(document, languageSelect.value, "options");
});

textCheckbox.addEventListener("change", saveSettings);
imageCheckbox.addEventListener("change", saveSettings);
languageSelect.addEventListener("change", saveSettings);
