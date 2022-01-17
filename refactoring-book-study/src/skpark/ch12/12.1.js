export class Party {
  constructor(monthlyCost) {
    this.monthlyCost = monthlyCost;
  }

  get annualCost() {
    return this.monthlyCost * 12;
  }
}

export class Employee extends Party {}

export class Department extends Party {}
