// monthを英語表記に変換する。
export function monthEncoder(month: number | number[]): string {
  const month_str: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  let monthList: string[] = []
  if (typeof month === "number") {
    monthList.push(month_str[month - 1])
  } else {
    month.forEach(m => {
      monthList.push(month_str[m - 1])
    })
  }
  return monthList.join("-")
}
