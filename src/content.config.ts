import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 更新頻度別にコレクションを分離する（要求仕様の核心）。
//   section : 稀にしか更新しない固定ページ（1ページ = サブディレクトリ + index.md）
//   members : 年1回更新（年度別・1人1ファイル）
//   news    : 随時更新（1記事 = 1ファイル）
// 研究成果（論文・受賞）は Markdown ではなく src/data/*.json で管理し、
// lib/achievements.ts でビルド時に整形する（ここには含めない）。

// 固定ページ。ページごとに構造が異なるため、各セクションは任意フィールドで持つ。
const section = defineCollection({
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/section',
    // research/index.md -> "research" のようにページ名を ID にする。
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      updated: z.coerce.date().optional(), // 各ページ右上の「更新日」
      lang: z.enum(['ja', 'en']).default('ja'),
      // ヒーロー画像（トップページ）。photo=PC用 / photo-sm=スマホ用（ハンバーガー切替時）
      photo: image().optional(),
      'photo-sm': image().optional(),
      // 小見出し付きの本文ブロック（研究概要・配属案内など）
      sections: z
        .array(z.object({ heading: z.string().optional(), body: z.string() }))
        .optional(),
      // 画像カード（研究紹介・研究環境）。group で見出しごとに束ねる。
      cards: z
        .array(
          z.object({
            title: z.string(),
            photo: image().optional(),
            body: z.string().optional(),
            group: z.string().optional(),
          }),
        )
        .optional(),
      // 学生の声（Q&A）
      qa: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
      // 関連サイト
      links: z.array(z.object({ label: z.string(), url: z.url() })).optional(),
      // コンタクト
      contacts: z.array(z.object({ name: z.string(), email: z.string() })).optional(),
    }),
});

// メンバー（年度別・学年別）
const members = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/members' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      'name-en': z.string().optional(), // 英語表記（名＋姓の順）
      role: z.string().optional(), // 教員の役職など
      grade: z.enum(['faculty', 'd', 'm2', 'm1', 'b4']),
      year: z.number().default(2024), // 年度
      photo: image().optional(),
      order: z.number().default(99), // 同一学年内の表示順
      lang: z.enum(['ja', 'en']).default('ja'),
    }),
});

// ニュース（随時更新）
const news = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['ja', 'en']).default('ja'),
  }),
});

// 研究紹介カード（1カード = 1ファイル）。group で見出しごとに束ね、order で並べる。
const research = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/research' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      group: z.string().optional(), // 稲村研／石田研
      order: z.number().default(99), // group 内の表示順
      photo: image().optional(),
      body: z.string().optional(), // カードの短い説明
      lang: z.enum(['ja', 'en']).default('ja'),
    }),
});

export const collections = { section, members, news, research };
