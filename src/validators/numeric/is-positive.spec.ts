import { validate, Validator, IsPositive } from "../../index";

describe("IsPositive", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsPositive()], 1).isValid).toBe(true);
    expect(validate([IsPositive()], -1).isValid).toBe(false);
    expect(validate([IsPositive()], 1.1).isValid).toBe(true);
    expect(validate([IsPositive()], NaN).isValid).toBe(false);
    expect(validate([IsPositive()], Infinity).isValid).toBe(true);

    expect(validate([IsPositive()], null).isValid).toBe(false);
    expect(validate([IsPositive()], undefined).isValid).toBe(false);

    expect(validate([IsPositive()], true).isValid).toBe(true);
    expect(validate([IsPositive()], "doia").isValid).toBe(false);
    expect(validate([IsPositive()], new Date(1998, 12, 25)).isValid).toBe(true);
    expect(validate([IsPositive()], [1, 2]).isValid).toBe(false);
    expect(validate([IsPositive()], { a: 1, b: "foo" }).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsPositive().validate(any)
    const valueA = "abc";
    const vErrA = validate([IsPositive()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be positive.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsPositive" },
    });

    // 2.2 IsPositive().validate(any, string, any)
    const targetB = { a: null };
    const vErrB = validate({ a: [IsPositive()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "a" value, expected null to be positive.`,
      value: null,
      propertyPath: "a",
      target: { a: null },
      validator: { name: "IsPositive" },
    });

    // 2.3 IsPositive(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsPositive(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsPositive with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsPositive" },
    });

    // 2.4 IsPositive(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsPositive(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsPositive Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsPositive" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsPositive(123)).toThrow(messageErr);
  });
});
