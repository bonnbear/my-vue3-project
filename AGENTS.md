# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## 核心概念

這是一個使用 Vue 3 和 Element Plus 的高度集中的單頁應用程式。整個應用程式的邏輯和 UI 都包含在單一檔案 `src/App.vue` 中，它作為一個本地狀態機來管理一個審批工作流程。

## 指令 (Commands)

- **啟動開發伺服器**: `npm run serve`
  - **注意**: 此指令配置了 8GB 的記憶體 (`--max-old-space-size=8192`)。伺服器運行在 `http://localhost:8081`。
- **建置**: `npm run build`
  - **注意**: 同樣配置了 8GB 的記憶體。
- **Linting**: **無**。專案已刻意禁用 ESLint。程式碼風格需手動遵循現有模式。
- **測試**: `npx playwright test` 或 `npx -y @executeautomation/playwright-mcp-server --headful`
  - **注意**: 專案使用 Playwright，但沒有 `test` 腳本。測試需手動執行。`config.json` 暗示可能使用一個特殊的 MCP 伺服器來執行測試。

## 關鍵架構與模式

- **單一檔案架構**: 所有應用程式邏輯、狀態和子元件都定義在 `src/App.vue` 內部。要修改任何功能，都必須編輯此檔案。
- **內部元件**: 子元件是使用 Vue 的 `defineComponent` 和 `h` (渲染函數) API 在 `<script setup>` 中動態建立的，而不是在單獨的 `.vue` 檔案中。
- **全域自動匯入**: `Element Plus` 元件和 `vue` / `vue-router` 的 API 是全域可用的，不需要在元件中手動 `import`。
- **全域圖示**: 所有 Element Plus 圖示都在 `src/main.js` 中全域註冊，可以直接在模板中使用 (例如 `<User />`)。
- **API 代理**: 開發時，所有對 `/api` 的請求都會被代理到 `http://localhost:3000`。