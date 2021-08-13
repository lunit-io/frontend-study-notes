import invoices from "../data/invoices.json";
import plays from "../data/plays.json";
import statement from "../statement";

const result = `<h1>청구 내역 (고객명: BigCo)</h1>\n<table>\n<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr><tr><td>Hamlet</td><td>($0.55석)</td><td>$650.00</td></tr>\n<tr><td>As You Like It</td><td>($0.35석)</td><td>$580.00</td></tr>\n<tr><td>Othello</td><td>($0.40석)</td><td>$500.00</td></tr>\n</table>\n<p>총액: <em>$1,730.00</em></p>\n<p>적립 포인트: <em>47</em>점</p>\n`;

test("statement result", () => {
  expect(statement(invoices[0], plays)).toBe(result);
});
