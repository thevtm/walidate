import { validate, Validator, IsInteger } from "../../index";

describe("IsInteger", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsInteger()], 1).isValid).toBe(true);
    expect(validate([IsInteger()], -1).isValid).toBe(true);
    expect(validate([IsInteger()], 1.1).isValid).toBe(false);
    expect(validate([IsInteger()], NaN).isValid).toBe(false);
    expect(validate([IsInteger()], Infinity).isValid).toBe(false);

    expect(validate([IsInteger()], null).isValid).toBe(false);
    expect(validate([IsInteger()], undefined).isValid).toBe(false);

    expect(validate([IsInteger()], true).isValid).toBe(false);
    expect(validate([IsInteger()], "doia").isValid).toBe(false);
    expect(validate([IsInteger()], new Date(1998, 12, 25)).isValid).toBe(false);
    expect(validate([IsInteger()], [1, 2]).isValid).toBe(false);
    expect(validate([IsInteger()], { a: 1, b: "foo" }).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsInteger().validate(any)
    const valueA = "abc";
    const vErrA = validate([IsInteger()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be an integer.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsInteger" },
    });

    // 2.2 IsInteger().validate(any, string, any)
    const targetB = { age: null };
    const vErrB = validate({ age: [IsInteger()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected null to be an integer.`,
      value: null,
      propertyPath: "age",
      target: { age: null },
      validator: { name: "IsInteger" },
    });

    // 2.3 IsInteger(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsInteger(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsInteger with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsInteger" },
    });

    // 2.4 IsInteger(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsInteger(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsInteger Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsInteger" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsInteger(123)).toThrow(messageErr);
  });
});
