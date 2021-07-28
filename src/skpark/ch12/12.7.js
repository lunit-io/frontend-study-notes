class Person {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }
  get genderCode() {
    return "X";
  }
}
class Male extends Person {
  get genderCode() {
    return "M";
  }
}

class Female extends Person {
  get genderCode() {
    return "F";
  }
}

export function createPerson(aRecord) {
  switch (aRecord.gender) {
    case "M":
      return new Male(aRecord.name);
    case "F":
      return new Female(aRecord.name);
    default:
      return new Person(aRecord.name);
  }
}
