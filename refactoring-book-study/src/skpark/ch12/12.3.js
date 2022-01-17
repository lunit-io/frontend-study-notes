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

  get id() {
    return this._id;
  }
}

export class Department extends Party {
  constructor(name, staff) {
    super(name);
    this._staff = staff;
  }
}
