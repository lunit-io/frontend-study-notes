class Employee {
  constructor(name) {
    this._name = name;
  }

  toString() {
    return `${this._name} (${this.type})`;
  }
}

class Engineer extends Employee {
  get type() {
    return "engineer";
  }
}

class Manager extends Employee {
  get type() {
    return "manager";
  }
}

class Salesperson extends Employee {
  get type() {
    return "salesperson";
  }
}

export function createEmployee(name, type) {
  switch (type) {
    case "engineer":
      return new Engineer(name);
    case "manager":
      return new Manager(name);
    case "salesperson":
      return new Salesperson(name);
    default:
      throw new Error(`${type}라는 직원 유형은 없습니다.`);
  }
}
