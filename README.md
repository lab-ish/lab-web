# 稲村・石田研究室 Web サイト

Astro で構築した研究室 Web サイト。GitHub Pages に公開する。
開発・ビルドは **Docker（node:24-alpine）** で行い、ローカルに Node を入れる必要はない。

## 必要なもの

- Docker / Docker Compose

## 開発・ビルド（Docker）

```sh
# 開発サーバ（http://localhost:4321/lab-web）
docker compose up

# 本番ビルド（dist/ に出力）
docker compose run --rm app npm run build

# 型チェック
docker compose run --rm app npm run check

# 依存の追加・更新など（例）
docker compose run --rm app npm install
```

## ディレクトリ構成

```text
src/
├── pages/            各ページ（ルーティング）
├── layouts/          共通レイアウト（BaseLayout）
├── components/       Nav・各種リスト・カードなど
├── content/          コンテンツ（更新頻度別に分離）
│   ├── section/      固定ページ（1ページ = サブディレクトリ + index.md）
│   ├── members/      メンバー（年度別・1人1ファイル）
│   └── news/         ニュース（1記事 = 1ファイル）
├── data/             研究成果データ（publications.json / awards.json）
├── lib/              achievements.ts（研究成果の整形）, url.ts
└── i18n/             UI文言の辞書（ja / en）
```

## コンテンツの更新方法

更新頻度ごとに置き場所を分けている。**更新する場所を間違えないこと。**

### ニュースを追加する（随時）

`src/content/news/` に Markdown を1ファイル追加するだけ。ファイル名は `YYYY-MM-DD-内容.md`。

```markdown
---
title: 〇〇で発表しました
date: 2026-07-01
---

本文をここに書く。
```

トップページに新しい3件が自動表示され、`/news` の一覧・年別アーカイブにも反映される。

### メンバーを更新する（年1回）

`src/content/members/<年度>/<学年>/` に1人1ファイルで追加する。学年は `faculty` / `d` / `m2` / `m1` / `b4`。

```markdown
---
name: 山田 太郎
grade: m1
year: 2026
order: 1
---
```

写真は `photo:` に画像パスを指定する（任意）。

### 固定ページ（研究内容・研究環境・学生の声 等）を編集する（まれ）

`src/content/section/<ページ>/index.md` を編集する。カードや Q&A は frontmatter の配列で管理する。

### 研究成果（論文・受賞）を更新する（随時）

- 論文: `src/data/publications.json` を編集（種別ごとに `items` を追加）。論文種別ごとに表示される。
- 受賞: `src/data/awards.json` を編集（`{ "date": "Jul 01, 2026", "author": "...", "award": "..." }`）。新しい順に表示される。

論文 PDF は `public/pdf/<pdf名>.pdf` に置き、JSON の `pdf` フィールドにファイル名（拡張子なし）を書く。

## デプロイ

`main` ブランチに push すると、GitHub Actions（`.github/workflows/deploy.yml`）が
自動でビルドして GitHub Pages に公開する。

公開 URL のサブパスは `astro.config.mjs` の `base`（暫定 `/lab-web`）で決まる。
リポジトリ名が決まったら `site` / `base` を合わせること。

## 多言語について

日本語で公開している。英語への拡張を見越し、i18n ルーティング（`ja` / `en`）と
UI 文言辞書（`src/i18n/ui.ts`）を用意してある。英語コンテンツは未作成（今後の作業）。
