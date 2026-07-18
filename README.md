# BUILD-A-LEGEND

以手機為核心的籃球球星建模遊戲。選擇位置後，透過六輪命運轉盤依序取得終結、投射、控球、組織、防守與體能，最後生成專屬球員卡並模擬新秀賽季。

## 本機啟動

```bash
npm install
npm run dev
```

## 部署到 GitHub Pages

1. 在 GitHub 建立一個空白 repository。
2. 將本專案推送到 `main` 分支。
3. 在 repository 的 **Settings → Pages → Build and deployment** 選擇 **GitHub Actions**。
4. 工作流程會自動建置並發布網站；之後每次推送到 `main` 都會自動更新。

專案已包含 `.github/workflows/deploy-pages.yml`，不需要另外設定部署指令。
