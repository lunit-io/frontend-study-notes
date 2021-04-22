import invoices from "./data/invoices.json";
import plays from "./data/plays.json";

const invoice = invoices[0];

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber);
}

function statement() {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    // print line for this order
    result += ` ${playFor(perf).name}: ${usd(amountFor(perf) / 100)} (${
      perf.audience
    } seats)\n`;
    totalAmount += amountFor(perf);
  }

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
  }

  result += `Amount owed is ${usd(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

function volumeCreditsFor(aPerformance) {
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0);

  if ("comedy" === playFor(aPerformance).type)
    result += Math.floor(aPerformance.audience / 5);

  return result;
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

export default statement;
