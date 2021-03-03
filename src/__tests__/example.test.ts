import { hello } from "../example";

test("basic", () => {
  expect(hello("m0r1m0")).toBe("Hello m0r1m0!");
});

test("no name", () => {
  expect(hello()).toBe("Hello World!");
});
