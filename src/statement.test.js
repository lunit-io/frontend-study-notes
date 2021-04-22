import { statement } from './index'
import invoice from './invoices.json'
import plays from './plays.json'

const result = `Statement for BigCo
 Hamlet: $650.00 (55 seats)
 As You Like It: $405.00 (35 seats)
 Othello: $500.00 (40 seats)
Amount owed is $1,555.00
You earned 47 credits
`

test('statement result', () => {
  expect(statement(invoice[0], plays)).toBe(result)
})
