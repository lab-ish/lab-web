import { ui, defaultLang, type Lang, type UIKey } from './ui';

// URL から言語を判定する（/en/... は en、それ以外は既定の ja）。
// astro.config の i18n.routing.prefixDefaultLocale=false に対応。
export function getLangFromUrl(url: URL): Lang {
  const [, maybeLang] = url.pathname.split('/');
  if (maybeLang === 'en') return 'en';
  return defaultLang;
}

// 指定言語の翻訳関数を返す。未定義キーは既定言語へフォールバック。
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
