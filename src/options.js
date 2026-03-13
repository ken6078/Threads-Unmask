const { DEFAULT_SETTINGS } = globalThis.ThreadsUnmaskCore;

const textCheckbox = document.querySelector("#remove-text-spoilers");
const imageCheckbox = document.querySelector("#remove-image-spoilers");
const status = document.querySelector("#status");

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
      removeImageSpoilers: imageCheckbox.checked
    },
    () => {
      showStatus("設定已儲存");
    }
  );
}

chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
  textCheckbox.checked = Boolean(stored.removeTextSpoilers);
  imageCheckbox.checked = Boolean(stored.removeImageSpoilers);
});

textCheckbox.addEventListener("change", saveSettings);
imageCheckbox.addEventListener("change", saveSettings);
