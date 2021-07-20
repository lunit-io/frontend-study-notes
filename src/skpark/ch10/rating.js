export default function rating(voyage, history) {
  return new Rating(voyage, history).value;
}
class Rating {
  // 함수들을 Rating 클래스로 묶었다.
  constructor(voyage, history) {
    this.voyage = voyage;
    this.history = history;
  }

  get value() {
    // 투자 등급
    const vpf = this.voyageProfitFactory;
    const vr = this.voyageRisk;
    const chr = this.captainHistoryRisk;
    if (vpf * 3 > vr + chr * 2) return "A";
    else return "B";
  }

  get voyageRisk() {
    // 항해 경로 위험 요소
    let result = 1;
    if (this.voyage.length > 4) result += 2;
    if (this.voyage.length > 8) result += this.voyage.length - 8;
    if (["중국", "동인도"].includes(this.voyage.zone)) result += 4;
    return Math.max(result, 0);
  }

  get captainHistoryRisk() {
    // 선장의 항해 이력 위험 요소
    let result = 1;
    if (this.history.length < 5) result += 4;
    result += this.history.filter((v) => v.profit < 0).length;
    if (this.voyage.zone === "중국" && this.hasChinaHistory) result -= 2;
    return Math.max(result, 0);
  }

  get voyageProfitFactory() {
    // 수익 요인
    let result = 2;
    if (this.voyage.zone === "중국") result += 1;
    if (this.voyage.zone === "동인도") result += 1;
    if (this.voyage.zone === "중국" && this.hasChinaHistory(history)) {
      result += 3;
      if (this.history.length > 10) result += 1;
      if (this.voyage.length > 12) result += 1;
      if (this.voyage.length > 18) result -= 1;
    } else {
      if (this.history.length > 8) result += 1;
      if (this.voyage.length > 14) result -= 1;
    }
    return result;
  }

  get hasChinaHistory() {
    // 중국을 경유하는가?
    return this.history.some((v) => "중국" === v.zone);
  }
}
