import { Employee, Department } from "./12.1";

describe("메서드 올리기", () => {
  it("works", () => {
    const employee = new Employee(5);
    const department = new Department(11);
    expect(employee.annualCost).toBe(60);
    expect(department.annualCost).toBe(132);
  });
});
