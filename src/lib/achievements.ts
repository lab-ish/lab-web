// 研究成果（論文・受賞）の共通処理モジュール。
// publications.json と awards.json を同じ src/data/ から読み込み、同じ仕組みで整形する。
//   - 論文: 論文種別（section）ごとに position 昇順、各種別内は年(→月)降順
//   - 受賞: date 降順の時系列
import publicationsData from '../data/publications.json';
import awardsData from '../data/awards.json';

export interface PublicationItem {
  lang: string | null;
  year: number;
  month: number;
  authors: string;
  title: string;
  in: string;
  vol_pp?: string | null;
  url?: string | null;
  pdf?: string | null; // PDF ファイル名スラッグ（public/pdf/<pdf>.pdf を想定）
  slide?: string | null; // スライドの URL
  emph?: string | null; // 特選論文・各賞などのバッジ文言
  note?: string | null; // open access 等の補足
}

export interface PublicationSection {
  title: string;
  position: number;
  items: PublicationItem[];
}

export interface Award {
  date: string; // "Jun 26, 2026" 形式
  author: string;
  award: string;
}

export interface DatedAward extends Award {
  parsedDate: Date;
}

// 論文: 種別ごとに position 昇順、各種別内は year(→month) 降順。
export function getPublicationSections(): PublicationSection[] {
  const sections = (publicationsData as unknown as PublicationSection[]).map((s) => ({
    ...s,
    items: [...s.items].sort(
      (a, b) => b.year - a.year || (b.month ?? 0) - (a.month ?? 0),
    ),
  }));
  return sections.sort((a, b) => a.position - b.position);
}

// 受賞: date 降順（時系列）。
export function getAwards(): DatedAward[] {
  return (awardsData as unknown as Award[])
    .map((a) => ({ ...a, parsedDate: new Date(a.date) }))
    .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime());
}

// 年の降順ユニーク配列を返すヘルパ。年フィルタの選択肢に使う。
function uniqueYearsDesc(years: number[]): number[] {
  return [...new Set(years)].sort((a, b) => b - a);
}

// 論文に存在する年の降順リスト（全種別横断）。
export function getPublicationYears(): number[] {
  return uniqueYearsDesc(
    getPublicationSections().flatMap((s) => s.items.map((i) => i.year)),
  );
}

// 受賞に存在する年の降順リスト（不正日付は除外）。
export function getAwardYears(): number[] {
  return uniqueYearsDesc(
    getAwards()
      .map((a) => a.parsedDate.getFullYear())
      .filter((y) => !Number.isNaN(y)),
  );
}
