import { Person, Male, Female } from "./12.7";

describe("서브클래스로 제거하기", () => {
  it("Person genderCode", () => {
    const person = new Person("aaa");
    expect(person.genderCode).toBe("X");
  });

  it("Male genderCode", () => {
    const male = new Male("bbb");
    expect(male.genderCode).toBe("M");
  });

  it("Female genderCode", () => {
    const female = new Female("ccc");
    expect(female.genderCode).toBe("F");
  });
});
