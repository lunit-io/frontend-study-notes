import { Employee, Department } from "./12.8";

describe("슈퍼클래스 추출하기", () => {
  it("Employee", () => {
    const employee = new Employee("aaa", 5, 8);
    expect(employee.name).toBe("aaa");
    expect(employee.monthlyCost).toBe(8);
    expect(employee.annualCost).toBe(96);
  });

  it("Department", () => {
    const department = new Department("bbb", [
      { monthlyCost: 4 },
      { monthlyCost: 27 },
      { monthlyCost: 11 },
    ]);
    expect(department.name).toBe("bbb");
    expect(department.totalMonthlyCose).toBe(42);
    expect(department.totalAnnualCost).toBe(504);
  });
});
