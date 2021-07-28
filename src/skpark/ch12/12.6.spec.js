import { createEmployee } from "./12.6";

describe("타입 코드를 서브클래스로 바꾸기", () => {
  it("engineer", () => {
    const employee = createEmployee("aaa", "engineer");
    expect(employee.toString()).toBe("aaa (engineer)");
  });

  it("manager", () => {
    const employee = createEmployee("bbb", "manager");
    expect(employee.toString()).toBe("bbb (manager)");
  });

  it("salesperson", () => {
    const employee = createEmployee("ccc", "salesperson");
    expect(employee.toString()).toBe("ccc (salesperson)");
  });

  it("undefined type", () => {
    const action = () => {
      const employee = createEmployee("ddd", "undefined type");
      employee.toString();
    };

    expect(action).toThrow("undefined type라는 직원 유형은 없습니다.");
  });
});
