# Threads Unmask - 移除防劇透

Chrome extension for `threads.com` that removes spoilers across multiple languages.

## Project structure

- `src/manifest.json`: Chrome Extension Manifest V3 config
- `src/content.js`: page scanner and spoiler reveal flow
- `src/lib/spoiler-helpers.js`: helper functions for detecting the spoiler background token
- `src/options.html` / `src/options.css` / `src/options.js`: settings page

## Install extension

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click `Load unpacked`
4. Select the `src` folder in this project

## Notes

The extension currently detects text spoiler overlays by looking for elements styled with:

- `background-color: var(--barcelona-navigation-icon)`

It also watches DOM changes so newly loaded posts are processed automatically.
