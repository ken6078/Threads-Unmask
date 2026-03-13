(function attachSpoilerHelpers(globalScope) {
  const DEFAULT_SETTINGS = {
    removeTextSpoilers: true,
    removeImageSpoilers: true
  };

  function normalizeStyleValue(value) {
    return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function getSpoilerVariableColor(element) {
    const localValue = normalizeStyleValue(
      window.getComputedStyle(element).getPropertyValue("--barcelona-navigation-icon")
    );
    if (localValue) {
      return localValue;
    }

    return normalizeStyleValue(
      window.getComputedStyle(document.documentElement).getPropertyValue("--barcelona-navigation-icon")
    );
  }

  function hasSpoilerBackgroundToken(element) {
    const inlineStyle = normalizeStyleValue(element.getAttribute("style"));
    return (
      inlineStyle.includes("background-color") &&
      inlineStyle.includes("var(--barcelona-navigation-icon)")
    );
  }

  function hasSpoilerBackground(element) {
    if (hasSpoilerBackgroundToken(element)) {
      return true;
    }

    const spoilerColor = getSpoilerVariableColor(element);
    if (!spoilerColor) {
      return false;
    }

    const backgroundColor = normalizeStyleValue(window.getComputedStyle(element).backgroundColor);
    return backgroundColor === spoilerColor;
  }

  function shouldHandleTextSpoilers(settings) {
    return settings.removeTextSpoilers;
  }

  function shouldHandleImageSpoilers(settings) {
    return settings.removeImageSpoilers;
  }

  function hasSpoilerLabelText(element) {
    return element instanceof HTMLElement && element.textContent.trim() === "劇透";
  }

  const exported = {
    DEFAULT_SETTINGS,
    normalizeStyleValue,
    getSpoilerVariableColor,
    hasSpoilerBackgroundToken,
    hasSpoilerBackground,
    shouldHandleTextSpoilers,
    shouldHandleImageSpoilers,
    hasSpoilerLabelText
  };

  globalScope.ThreadsUnmaskCore = exported;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = exported;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
