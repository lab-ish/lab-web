// GitHub Pages のサブパス公開に対応するため、内部リンク・画像は必ずこの helper を通す。
// import.meta.env.BASE_URL は astro.config の base（例: '/lab-web/'）に解決される。
export function href(path = '/'): string {
  const base = import.meta.env.BASE_URL; // 末尾スラッシュ付き想定（'/lab-web/'）
  const clean = path.startsWith('/') ? path.slice(1) : path;
  const baseSlash = base.endsWith('/') ? base : `${base}/`;
  return `${baseSlash}${clean}`;
}
