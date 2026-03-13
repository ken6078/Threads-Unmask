(function attachSpoilerHelpers(globalScope) {
  const DEFAULT_SETTINGS = {
    removeTextSpoilers: true,
    removeImageSpoilers: true,
    uiLanguage: "auto"
  };

  const SUPPORTED_LOCALES = ["zh-Hant", "zh-Hans", "en", "ja", "ko"];
  const IMAGE_SPOILER_LABELS = ["劇透", "剧透", "Spoiler", "ネタバレ", "스포일러"];
  const TRANSLATIONS = {
    "zh-Hant": {
      htmlLang: "zh-Hant",
      optionsTitle: "Threads Unmask Settings",
      popupTitle: "Threads Unmask",
      eyebrowOptions: "Chrome Extension",
      eyebrowPopup: "Threads Unmask",
      headingOptions: "Threads Unmask",
      headingPopup: "防劇透設定",
      intro: "自動移除 Threads 的文字與圖片防劇透遮罩。",
      optionsLabel: "選項",
      textLabel: "移除文字防劇透",
      textHelpOptions: "自動顯示被遮住的文字內容。",
      textHelpPopup: "在 Threads 自動顯示被遮住的文字。",
      imageLabel: "移除圖片防劇透",
      imageHelpOptions: "自動點開或拆除被標記為劇透的圖片遮罩。",
      imageHelpPopup: "自動點開或移除劇透圖片外層遮罩。",
      statusSavedOptions: "設定已儲存",
      statusSavedPopup: "已儲存",
      languageLabel: "語言",
      languageHelp: "切換擴充套件介面語言，或跟隨瀏覽器語言自動調整。",
      languageAuto: "跟隨瀏覽器",
      languageZhHant: "繁體中文",
      languageZhHans: "简体中文",
      languageEn: "English",
      languageJa: "日本語",
      languageKo: "한국어",
      aboutLabel: "關於",
      aboutSourcePrefix: "檢視",
      aboutSourceLink: "原始碼",
      aboutIssuePrefix: "有 Bug 或建議？",
      aboutIssueLink: "提交問題",
      openSettings: "開啟設定頁",
      logoAlt: "Threads Unmask logo"
    },
    "zh-Hans": {
      htmlLang: "zh-Hans",
      optionsTitle: "Threads Unmask Settings",
      popupTitle: "Threads Unmask",
      eyebrowOptions: "Chrome Extension",
      eyebrowPopup: "Threads Unmask",
      headingOptions: "Threads Unmask",
      headingPopup: "防剧透设置",
      intro: "自动移除 Threads 的文字与图片防剧透遮罩。",
      optionsLabel: "选项",
      textLabel: "移除文字防剧透",
      textHelpOptions: "自动显示被遮住的文字内容。",
      textHelpPopup: "在 Threads 自动显示被遮住的文字。",
      imageLabel: "移除图片防剧透",
      imageHelpOptions: "自动点开或拆除被标记为剧透的图片遮罩。",
      imageHelpPopup: "自动点开或移除剧透图片外层遮罩。",
      statusSavedOptions: "设置已保存",
      statusSavedPopup: "已保存",
      languageLabel: "语言",
      languageHelp: "切换扩展界面语言，或跟随浏览器语言自动调整。",
      languageAuto: "跟随浏览器",
      languageZhHant: "繁體中文",
      languageZhHans: "简体中文",
      languageEn: "English",
      languageJa: "日本語",
      languageKo: "한국어",
      aboutLabel: "关于",
      aboutSourcePrefix: "查看",
      aboutSourceLink: "源代码",
      aboutIssuePrefix: "有 Bug 或建议？",
      aboutIssueLink: "提交问题",
      openSettings: "打开设置页",
      logoAlt: "Threads Unmask logo"
    },
    en: {
      htmlLang: "en",
      optionsTitle: "Threads Unmask Settings",
      popupTitle: "Threads Unmask",
      eyebrowOptions: "Chrome Extension",
      eyebrowPopup: "Threads Unmask",
      headingOptions: "Threads Unmask",
      headingPopup: "Spoiler Settings",
      intro: "Automatically reveal spoiler-covered text and images on Threads.",
      optionsLabel: "Options",
      textLabel: "Reveal text spoilers",
      textHelpOptions: "Automatically show spoiler-covered text.",
      textHelpPopup: "Automatically show spoiler-covered text on Threads.",
      imageLabel: "Reveal image spoilers",
      imageHelpOptions: "Automatically click or unwrap image spoiler overlays.",
      imageHelpPopup: "Automatically click or remove spoiler image overlays.",
      statusSavedOptions: "Settings saved",
      statusSavedPopup: "Saved",
      languageLabel: "Language",
      languageHelp: "Choose the extension UI language, or follow your browser language automatically.",
      languageAuto: "Follow browser",
      languageZhHant: "Traditional Chinese",
      languageZhHans: "Simplified Chinese",
      languageEn: "English",
      languageJa: "Japanese",
      languageKo: "Korean",
      aboutLabel: "About",
      aboutSourcePrefix: "View",
      aboutSourceLink: "source code",
      aboutIssuePrefix: "Found a bug or have an idea?",
      aboutIssueLink: "Submit an issue",
      openSettings: "Open settings page",
      logoAlt: "Threads Unmask logo"
    },
    ja: {
      htmlLang: "ja",
      optionsTitle: "Threads Unmask Settings",
      popupTitle: "Threads Unmask",
      eyebrowOptions: "Chrome Extension",
      eyebrowPopup: "Threads Unmask",
      headingOptions: "Threads Unmask",
      headingPopup: "ネタバレ設定",
      intro: "Threads のテキストと画像のネタバレ遮罩を自動で解除します。",
      optionsLabel: "オプション",
      textLabel: "テキストのネタバレを解除",
      textHelpOptions: "隠されたテキストを自動で表示します。",
      textHelpPopup: "Threads で隠されたテキストを自動表示します。",
      imageLabel: "画像のネタバレを解除",
      imageHelpOptions: "ネタバレ付き画像のオーバーレイを自動で開くか解除します。",
      imageHelpPopup: "ネタバレ画像のオーバーレイを自動で開くか削除します。",
      statusSavedOptions: "設定を保存しました",
      statusSavedPopup: "保存しました",
      languageLabel: "言語",
      languageHelp: "拡張機能の表示言語を選ぶか、ブラウザの言語設定に自動で合わせます。",
      languageAuto: "ブラウザに合わせる",
      languageZhHant: "繁體中文",
      languageZhHans: "簡体中文",
      languageEn: "English",
      languageJa: "日本語",
      languageKo: "한국어",
      aboutLabel: "情報",
      aboutSourcePrefix: "",
      aboutSourceLink: "ソースコードを見る",
      aboutIssuePrefix: "不具合や提案がありますか？",
      aboutIssueLink: "Issue を送信",
      openSettings: "設定ページを開く",
      logoAlt: "Threads Unmask logo"
    },
    ko: {
      htmlLang: "ko",
      optionsTitle: "Threads Unmask Settings",
      popupTitle: "Threads Unmask",
      eyebrowOptions: "Chrome Extension",
      eyebrowPopup: "Threads Unmask",
      headingOptions: "Threads Unmask",
      headingPopup: "스포일러 설정",
      intro: "Threads의 텍스트 및 이미지 스포일러 가리개를 자동으로 해제합니다.",
      optionsLabel: "옵션",
      textLabel: "텍스트 스포일러 해제",
      textHelpOptions: "가려진 텍스트를 자동으로 표시합니다.",
      textHelpPopup: "Threads에서 가려진 텍스트를 자동으로 표시합니다.",
      imageLabel: "이미지 스포일러 해제",
      imageHelpOptions: "스포일러 이미지 오버레이를 자동으로 클릭하거나 제거합니다.",
      imageHelpPopup: "스포일러 이미지 오버레이를 자동으로 클릭하거나 제거합니다.",
      statusSavedOptions: "설정이 저장되었습니다",
      statusSavedPopup: "저장됨",
      languageLabel: "언어",
      languageHelp: "확장 프로그램 UI 언어를 선택하거나 브라우저 언어를 따라가도록 설정합니다.",
      languageAuto: "브라우저 따라가기",
      languageZhHant: "繁體中文",
      languageZhHans: "简体中文",
      languageEn: "English",
      languageJa: "日本語",
      languageKo: "한국어",
      aboutLabel: "정보",
      aboutSourcePrefix: "",
      aboutSourceLink: "소스 코드 보기",
      aboutIssuePrefix: "버그나 제안이 있나요?",
      aboutIssueLink: "이슈 등록",
      openSettings: "설정 페이지 열기",
      logoAlt: "Threads Unmask logo"
    }
  };

  function normalizeStyleValue(value) {
    return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function normalizeLocale(value) {
    const normalized = String(value || "").toLowerCase().replace("_", "-");

    if (normalized.startsWith("zh")) {
      if (
        normalized.includes("hans") ||
        normalized.includes("cn") ||
        normalized.includes("sg")
      ) {
        return "zh-Hans";
      }

      return "zh-Hant";
    }

    if (normalized.startsWith("ja")) {
      return "ja";
    }

    if (normalized.startsWith("ko")) {
      return "ko";
    }

    return "en";
  }

  function getPreferredLocale(uiLanguage) {
    if (uiLanguage && uiLanguage !== "auto") {
      return SUPPORTED_LOCALES.includes(uiLanguage) ? uiLanguage : "en";
    }

    return normalizeLocale(globalScope.navigator?.language || "en");
  }

  function getTranslations(uiLanguage) {
    const locale = getPreferredLocale(uiLanguage);
    return {
      locale,
      messages: TRANSLATIONS[locale]
    };
  }

  function localizeDocument(documentNode, uiLanguage, scopeName) {
    const { locale, messages } = getTranslations(uiLanguage);
    const scopeSuffix = scopeName === "popup" ? "Popup" : "Options";

    documentNode.documentElement.lang = messages.htmlLang;
    documentNode.title = scopeName === "popup" ? messages.popupTitle : messages.optionsTitle;

    for (const element of documentNode.querySelectorAll("[data-i18n]")) {
      const key = element.dataset.i18n;
      if (messages[key]) {
        element.textContent = messages[key];
      }
    }

    for (const element of documentNode.querySelectorAll("[data-i18n-placeholder]")) {
      const key = element.dataset.i18nPlaceholder;
      if (messages[key]) {
        element.setAttribute("placeholder", messages[key]);
      }
    }

    for (const element of documentNode.querySelectorAll("[data-i18n-alt]")) {
      const key = element.dataset.i18nAlt;
      if (messages[key]) {
        element.setAttribute("alt", messages[key]);
      }
    }

    for (const element of documentNode.querySelectorAll("[data-i18n-aria-label]")) {
      const key = element.dataset.i18nAriaLabel;
      if (messages[key]) {
        element.setAttribute("aria-label", messages[key]);
        element.setAttribute("title", messages[key]);
      }
    }

    const eyebrow = documentNode.querySelector("[data-i18n-eyebrow]");
    if (eyebrow) {
      eyebrow.textContent = scopeName === "popup" ? messages.eyebrowPopup : messages.eyebrowOptions;
    }

    const textHelp = documentNode.querySelector("[data-i18n-text-help]");
    if (textHelp) {
      textHelp.textContent = scopeName === "popup" ? messages.textHelpPopup : messages.textHelpOptions;
    }

    const imageHelp = documentNode.querySelector("[data-i18n-image-help]");
    if (imageHelp) {
      imageHelp.textContent = scopeName === "popup" ? messages.imageHelpPopup : messages.imageHelpOptions;
    }

    for (const element of documentNode.querySelectorAll("[data-i18n-language-help]")) {
      element.textContent = messages.languageHelp;
    }

    const statusSavedKey = `statusSaved${scopeSuffix}`;

    return {
      locale,
      messages,
      statusSaved: messages[statusSavedKey]
    };
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
    return element instanceof HTMLElement && IMAGE_SPOILER_LABELS.includes(element.textContent.trim());
  }

  const exported = {
    DEFAULT_SETTINGS,
    SUPPORTED_LOCALES,
    TRANSLATIONS,
    IMAGE_SPOILER_LABELS,
    normalizeStyleValue,
    normalizeLocale,
    getPreferredLocale,
    getTranslations,
    localizeDocument,
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
