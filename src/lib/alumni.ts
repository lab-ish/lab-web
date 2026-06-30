// OB/OG（卒業生）の整形モジュール。
// alumni.json を読み込み、卒業年度の降順・年度内は学位順でグルーピングして返す。
// 顔写真は持たず、名簿としてのリストアップのみを想定する。
import alumniData from '../data/alumni.json';

export type Degree = 'doctor' | 'master' | 'bachelor';

export interface Alumnus {
  year: number; // 卒業年度
  degree: Degree;
  name: string;
  note?: string | null; // 進路など（任意）
}

export interface AlumniYearGroup {
  year: number;
  members: Alumnus[];
}

// 年度内の学位の並び順（博士→修士→学士）。
const degreeOrder: Record<Degree, number> = { doctor: 0, master: 1, bachelor: 2 };

export function getAlumni(): AlumniYearGroup[] {
  const list = alumniData as Alumnus[];
  const years = [...new Set(list.map((a) => a.year))].sort((a, b) => b - a);
  return years.map((year) => ({
    year,
    members: list
      .filter((a) => a.year === year)
      .sort(
        (a, b) =>
          degreeOrder[a.degree] - degreeOrder[b.degree] ||
          a.name.localeCompare(b.name, 'ja'),
      ),
  }));
}
