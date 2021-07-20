import { Customer, UnknownCustomer, getCustomerName } from "./power-company";

describe("전력회사", () => {
  describe("고객이름", () => {
    it("미확인 고객", () => {
      expect(getCustomerName(new UnknownCustomer())).toEqual("거주자");
    });
    it("Customer 고객", () => {
      expect(getCustomerName(new Customer("skpark"))).toEqual("skpark");
    });
    it("잘못된 값", () => {
      expect(() => getCustomerName("skpark")).toThrow(
        "잘못된 값과 비교: skpark"
      );
    });
  });
});
