export class Party {
  constructor(monthlyCost) {
    this.monthlyCost = monthlyCost;
  }
}

export class Employee extends Party {
  get annualCost() {
    return this.monthlyCost * 12;
  }
}

export class Department extends Party {
  get annualCost() {
    return this.monthlyCost * 12;
  }
}
