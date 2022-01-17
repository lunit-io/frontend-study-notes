import { createPerson } from "./12.7";

describe("서브클래스로 제거하기", () => {
  it("Person genderCode", () => {
    const person = createPerson({ name: "aaa", gender: "X" });
    expect(person.genderCode).toBe("X");
  });

  it("Male genderCode", () => {
    const male = createPerson({ name: "bbb", gender: "M" });
    expect(male.genderCode).toBe("M");
  });

  it("Female genderCode", () => {
    const female = createPerson({ name: "ccc", gender: "F" });
    expect(female.genderCode).toBe("F");
  });
});
