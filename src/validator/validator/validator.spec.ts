import { Validator, isValidator, isValidators, IsNumber, IsArray, IsOptional } from "../../index";

describe("Validator", () => {
  it("constructor() should throw when it receives invalid arguments", () => {
    /* 1. name */

    // @ts-ignore
    expect(() => new Validator()).toThrow(`Argument name should be a non empty string.`);
    // @ts-ignore
    expect(() => new Validator("")).toThrow(`Argument name should be a non empty string.`);
  });
});

describe("isValidator", () => {
  it("should return a boolean according to spec", () => {
    expect(isValidator(IsNumber())).toBe(true);
    expect(isValidator(IsArray())).toBe(true);

    // @ts-ignore
    expect(isValidator()).toBe(false);
    expect(isValidator(null)).toBe(false);
    expect(isValidator(true)).toBe(false);
    expect(isValidator(1)).toBe(false);
    expect(isValidator("foo")).toBe(false);
    expect(isValidator([1, 1])).toBe(false);
    expect(isValidator({ a: 1 })).toBe(false);

    // @ts-ignore
    expect(isValidator(3)).toBe(false);
  });
});

describe("isValidators", () => {
  it("should return a boolean according to spec", () => {
    expect(isValidators([IsNumber()])).toBe(true);
    expect(isValidators([IsArray()])).toBe(true);
    expect(isValidators([IsOptional(), IsNumber()])).toBe(true);

    // @ts-ignore
    expect(isValidators()).toBe(false);
    expect(isValidators(true)).toBe(false);
    expect(isValidators(1)).toBe(false);
    expect(isValidators("foo")).toBe(false);
    expect(isValidators([1, 1])).toBe(false);
    expect(isValidators({ a: 1 })).toBe(false);
    expect(isValidators(["foo", IsNumber()])).toBe(false);
  });
});
