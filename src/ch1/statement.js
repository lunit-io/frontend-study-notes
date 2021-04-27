import invoices from "./data/invoices.json";
import plays from "./data/plays.json";

const invoice = invoices[0];

function statement() {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);

    // print line for this order
    result += ` ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${
      perf.audience
    } seats)\n`;
    totalAmount += amountFor(perf);
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

export default statement;

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function volumeCreditsFor(perf) {
  let volumeCredits = 0;
  volumeCredits += Math.max(perf.audience - 30, 0);
  // add extra credit for every ten comedy attendees
  if ("comedy" === playFor(perf).type)
    volumeCredits += Math.floor(perf.audience / 5);

  return volumeCredits;
}

function amountFor(aPerformance) {
  let result = 0;

  switch (playFor(aPerformance).type) {
    case "tragedy":
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 300 * aPerformance.audience;
      }
      break;
    default:
      throw new Error(`unknown type: ${playFor(aPerformance).type}`);
  }

  return result;
}
