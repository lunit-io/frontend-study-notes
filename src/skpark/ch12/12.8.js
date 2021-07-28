export class Employee {
  constructor(name, id, monthlyCost) {
    this._name = name;
    this._id = id;
    this._monthlyCost = monthlyCost;
  }

  get monthlyCost() {
    // 월간 비용
    return this._monthlyCost;
  }

  get name() {
    return this._name;
  }

  get id() {
    return this._id;
  }

  get annualCost() {
    // 연간 비용
    return this.monthlyCost * 12;
  }
}

export class Department {
  constructor(name, staff) {
    this._name = name;
    this._staff = staff;
  }

  get staff() {
    return this._staff;
  }

  get name() {
    return this._name;
  }

  get totalMonthlyCose() {
    return this.staff
      .map((e) => e.monthlyCost)
      .reduce((sum, cost) => sum + cost);
  }

  get headCount() {
    return this.staff.length;
  }

  get totalAnnualCost() {
    return this.totalMonthlyCose * 12;
  }
}
