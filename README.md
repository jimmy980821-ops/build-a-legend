# BUILD-A-LEGEND

以手機為核心的籃球球星建模遊戲。每輪先抽取一支球隊，再從該隊名單選一位球員，奪取他的其中一項能力。集滿三分、中投、終結、灌籃、護球、傳球、外防、內防、阻攻、籃板、運動、力量與關鍵共 13 項能力後，生成專屬球員卡並模擬新秀賽季。

## 本機啟動

```bash
npm install
npm run dev
```

## 部署到 GitHub Pages

1. 將本專案推送到 GitHub 的 `main` 分支。
2. 在 Repository 的 **Settings → Pages → Build and deployment** 選擇 **GitHub Actions**。
3. `.github/workflows/deploy-pages.yml` 會自動建置並發布網站。

之後每次推送到 `main`，網站都會自動更新。
