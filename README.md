# cssjpn-feed-aggregator

[日本マイクロソフト サポート情報](https://cssjpn.github.io/) にリンクされている各サポートチーム BLOG の最新記事を自動集約し、一覧表示する静的サイトです。

## 仕組み

1. GitHub Actions が毎時 `feeds.yml` に登録された Atom/RSS フィードを取得
2. 全記事を日付降順でマージし `public/data/feeds.json` に出力
3. GitHub Pages にデプロイ — フロントエンドは JSON を読んで描画

## ローカル開発

```bash
npm install
npm run fetch       # フィードを取得して public/data/feeds.json を生成
npm run dev         # ローカルサーバー起動 (http://localhost:3000)
```

## フィードの追加・削除

`feeds.yml` を編集してください。次回の Actions 実行で反映されます。

## 構成

```
feeds.yml                   # ブログ一覧 (YAML)
scripts/fetch-feeds.js      # フィード取得スクリプト
public/index.html           # フロントエンド
public/data/feeds.json      # 生成される記事データ (git 管理外)
.github/workflows/update.yml
```
