import statement from "./statement";
import invoices from "./data/invoices.json";
import plays from "./data/plays.json";

const result = `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $405.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,555.00
You earned 47 credits
`;

test("statement result", () => {
  expect(statement(invoices[0], plays)).toBe(result);
});
