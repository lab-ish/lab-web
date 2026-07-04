// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// GitHub Pages 公開設定。リポジトリ名が確定したら site/base を合わせること
// （ユーザー/組織ページなら base 不要）。
// 内部リンク・画像は import.meta.env.BASE_URL 経由とし、相対参照しない。
export default defineConfig({
  site: 'https://lab-ish.com',
  base: '',

  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: {
      prefixDefaultLocale: false, // 既定言語(ja)は接頭辞なし、en は /en/...
    },
  },

  vite: {
    plugins: [tailwindcss()]
  }
});
