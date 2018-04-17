import { validate, Validator, IsNegative } from "../../index";

describe("IsNegative", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsNegative()], 1).isValid).toBe(false);
    expect(validate([IsNegative()], -1).isValid).toBe(true);
    expect(validate([IsNegative()], 1.1).isValid).toBe(false);
    expect(validate([IsNegative()], NaN).isValid).toBe(false);
    expect(validate([IsNegative()], Infinity).isValid).toBe(false);

    expect(validate([IsNegative()], null).isValid).toBe(false);
    expect(validate([IsNegative()], undefined).isValid).toBe(false);

    expect(validate([IsNegative()], true).isValid).toBe(false);
    expect(validate([IsNegative()], "doia").isValid).toBe(false);
    expect(validate([IsNegative()], new Date(1998, 12, 25)).isValid).toBe(false);
    expect(validate([IsNegative()], [1, 2]).isValid).toBe(false);
    expect(validate([IsNegative()], { a: 1, b: "foo" }).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsNegative().validate(any)
    const valueA = "abc";
    const vErrA = validate([IsNegative()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be negative.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsNegative" },
    });

    // 2.2 IsNegative().validate(any, string, any)
    const targetB = { a: null };
    const vErrB = validate({ a: [IsNegative()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "a" value, expected null to be negative.`,
      value: null,
      propertyPath: "a",
      target: { a: null },
      validator: { name: "IsNegative" },
    });

    // 2.3 IsNegative(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsNegative(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsNegative with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsNegative" },
    });

    // 2.4 IsNegative(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsNegative(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsNegative Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsNegative" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsNegative(123)).toThrow(messageErr);
  });
});
