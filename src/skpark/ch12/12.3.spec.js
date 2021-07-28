import { Employee, Department } from "./12.3";

describe("생성자 본문 올리기", () => {
  it("works", () => {
    const employee = new Employee("aaa", 3, 10);
    const department = new Department("bbb", "staff");
    expect(employee.name).toBe("aaa");
    expect(department.name).toBe("bbb");
  });
});
