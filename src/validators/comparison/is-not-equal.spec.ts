import { validate, Validator, IsNotEqual } from "../../index";

describe("IsNotEqual", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsNotEqual(true)], true).isValid).toBe(false);
    expect(validate([IsNotEqual(false)], true).isValid).toBe(true);

    expect(validate([IsNotEqual(0)], 0).isValid).toBe(false);
    expect(validate([IsNotEqual(1230)], -10).isValid).toBe(true);
    expect(validate([IsNotEqual(NaN)], NaN).isValid).toBe(false);
    expect(validate([IsNotEqual(12)], Infinity).isValid).toBe(true);

    expect(validate([IsNotEqual("avs")], "avs").isValid).toBe(false);
    expect(validate([IsNotEqual("aaa")], "bbb").isValid).toBe(true);

    expect(validate([IsNotEqual([1, 2, 3])], [1, 2, 3]).isValid).toBe(false);
    expect(validate([IsNotEqual([1, 2, 3])], [1, 2]).isValid).toBe(true);

    expect(validate([IsNotEqual({ a: 1 })], { a: 1 }).isValid).toBe(false);
    expect(validate([IsNotEqual({ a: 1 })], { a: { b: 2 } }).isValid).toBe(true);
    expect(validate([IsNotEqual({ a: { b: { c: 3 } } })], { a: { b: { c: 3 } } }).isValid).toBe(false);

    expect(validate([IsNotEqual(null)], null).isValid).toBe(false);
    expect(validate([IsNotEqual(undefined)], null).isValid).toBe(true);

    expect(validate([IsNotEqual(new Date(1998, 12, 25))], new Date(1998, 12, 25)).isValid).toBe(false);
    expect(validate([IsNotEqual(new Date(2313, 12, 25))], new Date(1998, 12, 25)).isValid).toBe(true);

    /* 2. ValidationError */

    // 2.1 IsNotEqual().validate(any)
    const valueA = "abc";
    const vErrA = validate([IsNotEqual(valueA)], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to not be equal to "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: {
        name: "IsNotEqual",
        options: { to: "abc" },
      },
    });

    // 2.2 IsNotEqual().validate(any, string, any)
    const targetB = { age: null };
    const vErrB = validate({ age: [IsNotEqual(null)] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected null to not be equal to null.`,
      value: null,
      propertyPath: "age",
      target: { age: null },
      validator: {
        name: "IsNotEqual",
        options: { to: null },
      },
    });

    // 2.3 IsNotEqual(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsNotEqual("abc", messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsNotEqual with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: {
        name: "IsNotEqual",
        options: { to: "abc" },
      },
    });

    // 2.4 IsNotEqual(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsNotEqual("abc", messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsNotEqual Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: {
        name: "IsNotEqual",
        options: { to: "abc" },
      },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. to */
    // not throw

    /* 2. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsNotEqual(123, 123)).toThrow(messageErr);
  });
});
