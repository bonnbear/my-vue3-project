# Project Debugging Rules (Non-Obvious Only)

- **API 代理**: 所有對 `/api` 的請求都被代理到 `http://localhost:3000`。如果 API 請求失敗，請檢查代理目標伺服器是否正在運行。
- **單一元件狀態**: 整個應用程式的狀態都在 `src/App.vue` 中。調試狀態問題需要追蹤此檔案內的 `ref` 和 `computed` 屬性。
- **高記憶體佔用**: `serve` 和 `build` 指令都配置了 8GB 記憶體。如果應用程式崩潰或運行緩慢，可能是記憶體問題。
- **無 Linter 錯誤**: 由於 ESLint 已被禁用，不會有任何 linting 錯誤。問題很可能來自邏輯或運行時錯誤。
- **測試環境**: 測試是透過 `@executeautomation/playwright-mcp-server` 執行的，而不是標準的 Playwright。調試測試問題需要考慮這個特殊環境。