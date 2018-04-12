import { validate, Validator, IsEqual } from "../../index";

describe("IsEqual", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsEqual(true)], true).isValid).toBe(true);
    expect(validate([IsEqual(false)], true).isValid).toBe(false);

    expect(validate([IsEqual(0)], 0).isValid).toBe(true);
    expect(validate([IsEqual(1230)], -10).isValid).toBe(false);
    expect(validate([IsEqual(NaN)], NaN).isValid).toBe(true);
    expect(validate([IsEqual(12)], Infinity).isValid).toBe(false);

    expect(validate([IsEqual("avs")], "avs").isValid).toBe(true);
    expect(validate([IsEqual("aaa")], "bbb").isValid).toBe(false);

    expect(validate([IsEqual([1, 2, 3])], [1, 2, 3]).isValid).toBe(true);
    expect(validate([IsEqual([1, 2, 3])], [1, 2]).isValid).toBe(false);

    expect(validate([IsEqual({ a: 1 })], { a: 1 }).isValid).toBe(true);
    expect(validate([IsEqual({ a: 1 })], { a: { b: 2 } }).isValid).toBe(false);
    expect(validate([IsEqual({ a: { b: { c: 3 } } })], { a: { b: { c: 3 } } }).isValid).toBe(true);

    expect(validate([IsEqual(null)], null).isValid).toBe(true);
    expect(validate([IsEqual(undefined)], null).isValid).toBe(false);

    expect(validate([IsEqual(new Date(1998, 12, 25))], new Date(1998, 12, 25)).isValid).toBe(true);
    expect(validate([IsEqual(new Date(2313, 12, 25))], new Date(1998, 12, 25)).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsEqual().validate(any)
    const valueA = "abc";
    const toA = 132;
    const vErrA = validate([IsEqual(toA)], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be equal to 132.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsEqual", options: { to: 132 } },
    });

    // 2.2 IsEqual().validate(any, string, any)
    const targetB = { age: null };
    const toB = [1];
    const vErrB = validate({ age: [IsEqual(toB)] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected null to be equal to [1].`,
      value: null,
      propertyPath: "age",
      target: { age: null },
      validator: { name: "IsEqual", options: { to: [1] } },
    });

    // 2.3 IsEqual(messageFn).validate(any)
    const valueC = "abc";
    const toC = null;
    const messageFnC = ({ validator, value }) =>
      `Error at ${validator.name} with value ${JSON.stringify(value)}, options: ${JSON.stringify(validator.options)}.`;
    const vErrC = validate([IsEqual(toC, messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsEqual with value "abc", options: {"to":null}.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsEqual", options: { to: null } },
    });

    // 2.4 IsEqual(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const toD = "bob";
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsEqual(toD, messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsEqual Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsEqual", options: { to: "bob" } },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. to */
    // not throw

    /* 2. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsEqual(123, 123)).toThrow(messageErr);
  });
});
