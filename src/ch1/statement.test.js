import { statement, htmlStatement } from "./statement";

const result = `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $405.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,555.00
You earned 47 credits
`;

// const htmlResult = `<h1>Statement for BigCo</h1>
// <table>
// <tr><th>play</th><th>seats</th><th>cost</th></tr>  <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>
//   <tr><td>As You Like It</td><td>35</td><td>$405.00</td></tr>
//   <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>
// </table>
// <p>Amount owed is <em>$1,555.00</em></p>
// <p>You earned <em>47</em> credits</p>`;

let htmlResult = `<h1>Statement for BigCo</h1>\n`;
htmlResult += "<table>\n";
htmlResult += `<tr><th>play</th><th>seats</th><th>cost</th></tr>  <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n`;
htmlResult += `  <tr><td>As You Like It</td><td>35</td><td>$405.00</td></tr>\n`;
htmlResult += `  <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n`;
htmlResult += "</table>\n";
htmlResult += `<p>Amount owed is <em>$1,555.00</em></p>\n`;
htmlResult += `<p>You earned <em>47</em> credits</p>\n`;

test("statement result", () => {
  expect(statement()).toBe(result);
});
test("html statement result", () => {
  expect(htmlStatement()).toBe(htmlResult);
});
