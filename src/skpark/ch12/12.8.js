class Party {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }
}

export class Employee extends Party {
  constructor(name, id, monthlyCost) {
    super(name);
    this._id = id;
    this._monthlyCost = monthlyCost;
  }

  get monthlyCost() {
    // 월간 비용
    return this._monthlyCost;
  }

  get id() {
    return this._id;
  }

  get annualCost() {
    // 연간 비용
    return this.monthlyCost * 12;
  }
}

export class Department extends Party {
  constructor(name, staff) {
    super(name);
    this._staff = staff;
  }

  get staff() {
    return this._staff;
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
