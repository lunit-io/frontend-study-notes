import rating from "./rating";

describe("등급계산", () => {
  test("first", () => {
    const voyage = { zone: "서인도", length: 10 };
    const history = [
      { zone: "동인도", profit: 5 },
      { zone: "서인도", profit: 15 },
      { zone: "중국", profit: -2 },
      { zone: "서아프리카", profit: 7 },
    ];
    expect(rating(voyage, history)).toEqual("B");
  });
});
