# cssjpn-feed-aggregator

[日本マイクロソフト サポート情報](https://cssjpn.github.io/) にリンクされている各サポートチーム BLOG の最新記事を自動集約し、一覧表示する静的サイトです。

## 公開ページ

**https://kemaruya.github.io/cssjpn-feed-aggregator/**

## 仕組み

1. GitHub Actions が毎時 `feeds.yml` に登録された Atom/RSS フィードを取得
2. 全記事を日付 (公開日) 降順でマージし `public/data/feeds.json` に出力
3. GitHub Pages にデプロイ — フロントエンドは JSON を読んで描画

## 取得対象フィード一覧

### Office / Exchange / SharePoint / Teams / Intune

| ブログ名 | サイト | Feed URL |
|---|---|---|
| Exchange & Outlook サポート | https://jpmessaging.github.io/blog/ | [atom.xml](https://jpmessaging.github.io/blog/atom.xml) |
| SharePoint サポート チーム | https://jpspsupport.github.io/blog/ | [atom.xml](https://jpspsupport.github.io/blog/atom.xml) |
| Office サポート チーム | https://officesupportjp.github.io/blog/ | [atom.xml](https://officesupportjp.github.io/blog/atom.xml) |
| Microsoft Japan UC Support Team | https://jpucsupport.github.io/blog/ | [atom.xml](https://jpucsupport.github.io/blog/atom.xml) |
| Japan Microsoft Intune Support Team | https://jpmem.github.io/blog/ | [atom.xml](https://jpmem.github.io/blog/atom.xml) |

### Azure

| ブログ名 | サイト | Feed URL |
|---|---|---|
| Azure IaaS and Networking Support | https://jpaztech.github.io/blog/ | [atom.xml](https://jpaztech.github.io/blog/atom.xml) |
| Azure Subscription Management Support | https://jpazasms.github.io/blog/ | [atom.xml](https://jpazasms.github.io/blog/atom.xml) |
| Japan CSS ABRS (Backup/Recovery) | https://jpabrs-scem.github.io/blog/ | [atom.xml](https://jpabrs-scem.github.io/blog/atom.xml) |
| Azure Monitoring Support | https://jpazmon-integ.github.io/blog/ | [atom.xml](https://jpazmon-integ.github.io/blog/atom.xml) |
| Azure Integration Support | https://jpazinteg.github.io/blog/ | [atom.xml](https://jpazinteg.github.io/blog/atom.xml) |
| Azure PaaS サポート チーム | https://azure.github.io/jpazpaas/ | [atom.xml](https://azure.github.io/jpazpaas/atom.xml) |
| Azure Identity サポート チーム | https://jpazureid.github.io/blog/ | [atom.xml](https://jpazureid.github.io/blog/atom.xml) |
| Azure Machine Learning サポート | https://jpmlblog.github.io/blog/ | [atom.xml](https://jpmlblog.github.io/blog/atom.xml) |
| Azure Cognitive Services サポート | https://jpaiblog.github.io/blog/ | [atom.xml](https://jpaiblog.github.io/blog/atom.xml) |
| Japan IoT サポート | https://jpiotblog.github.io/blog/ | [atom.xml](https://jpiotblog.github.io/blog/atom.xml) |
| Azure DevOps サポート チーム | https://jpdscore.github.io/blog/ | [atom.xml](https://jpdscore.github.io/blog/atom.xml) |
| Azure Big Data Integration サポート | https://jpaz-bigdata.github.io/blog/ | [atom.xml](https://jpaz-bigdata.github.io/blog/atom.xml) |

### Windows / Security / System Center

| ブログ名 | サイト | Feed URL |
|---|---|---|
| Japan Windows Commercial Support | https://jpwinsup.github.io/blog/ | [atom.xml](https://jpwinsup.github.io/blog/atom.xml) |
| Security サポート チーム | https://jp-sec.github.io/blog/ | [atom.xml](https://jp-sec.github.io/blog/atom.xml) |
| Japan System Center Support | https://jpsystemcenter.github.io/blog/ | [atom.xml](https://jpsystemcenter.github.io/blog/atom.xml) |

### Developer

| ブログ名 | サイト | Feed URL |
|---|---|---|
| Windows Driver Kit サポート | https://jpwdkblog.github.io/blog/ | [atom.xml](https://jpwdkblog.github.io/blog/atom.xml) |

### Edge / IE / IIS

| ブログ名 | サイト | Feed URL |
|---|---|---|
| Edge/IE サポート チーム | https://microsoft.github.io/jpbrowsers/ | [atom.xml](https://microsoft.github.io/jpbrowsers/atom.xml) |

### SQL / Power BI

| ブログ名 | サイト | Feed URL |
|---|---|---|
| Power BI サポート チーム | https://jpbap-sqlbi.github.io/blog/ | [atom.xml](https://jpbap-sqlbi.github.io/blog/atom.xml) |
| SQL Cloud サポート チーム | https://jp-azuresql.github.io/blog/ | [atom.xml](https://jp-azuresql.github.io/blog/atom.xml) |
| PaaS OSS データベース サポート | https://jp-ossdb.github.io/blog/ | [atom.xml](https://jp-ossdb.github.io/blog/atom.xml) |

### Dynamics

| ブログ名 | サイト | Feed URL |
|---|---|---|
| Dynamics 365 CRM & Power Platform | https://jpdynamicscrm.github.io/blog/ | [atom.xml](https://jpdynamicscrm.github.io/blog/atom.xml) |
| Dynamics 365 Finance and Operations/AX | https://jpd365erpsup.github.io/blog/ | [atom.xml](https://jpd365erpsup.github.io/blog/atom.xml) |

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
