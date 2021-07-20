class Site {
  get customer() {
    return this._customer === "미확인 고객"
      ? new UnknownCustomer()
      : this._customer;
  }
}

export class Customer {
  constructor(name) {
    this._name = name;
  }
  get name() {
    return this._name;
  } // 고객 이름
  get billingPlan() {} // 요금제
  set billingPlan(arg) {}
  get paymentHistory() {} // 납부이력
  get isUnknown() {
    return false;
  }
}

export class UnknownCustomer {
  get isUnknown() {
    return true;
  }

  get name() {
    return "거주자";
  }
}

function isUnknown(arg) {
  console.log("arg", arg);
  if (!(arg instanceof Customer || arg instanceof UnknownCustomer)) {
    throw new Error(`잘못된 값과 비교: ${arg}`);
  }
  return arg.isUnknown;
}

export function getCustomerName(customer) {
  if (isUnknown(customer)) return "거주자";
  else return customer.name;
}

export function getPlan(customer) {
  return isUnknown(customer) ? 0 : customer.billingPlan;
}

export function getWeeksDelinquent(customer) {
  return isUnknown(customer)
    ? 0
    : customer.paymentHistory.weeksDelinquentInLastYear;
}
