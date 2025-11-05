# Project Documentation Rules (Non-Obvious Only)

- **核心檔案**: `src/App.vue` 是唯一需要關注的核心檔案。它包含了幾乎所有的應用程式邏輯、UI 和狀態。
- **反直覺的元件結構**: 當被問及元件時，請記住子元件是在 `src/App.vue` 內部使用渲染函數 `h()` 定義的，而不是在單獨的 `.vue` 檔案中。
- **無狀態管理庫**: 當被問及狀態管理時，答案是它完全由 `src/App.vue` 內部的 `ref` 和 `computed` 處理，沒有使用 Pinia 或 Vuex。
- **全域可用性**: 當被問及為何某些元件或 API (如 `ElButton`, `ref`) 沒有匯入時，答案是它們是透過 `unplugin-auto-import` 全域提供的。