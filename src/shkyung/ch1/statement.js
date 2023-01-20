import createStatementData from "./createStatementData";

export default function htmlStatement(invoice, plays) {
  return renderHTML(createStatementData(invoice, plays))
}

function renderHTML(data) {
  let result = `<h1>청구 내역 (고객명: ${data.customer})</h1>\n`;
  result += "<table>\n"
  result += "<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>"

  for (let perf of data.performances) {
    result += `<tr><td>${perf.play.name}</td><td>(${usd(perf.audience)}석)</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`
  }
  result += "</table>\n"

  result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`
  result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n`
  return result;
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}
