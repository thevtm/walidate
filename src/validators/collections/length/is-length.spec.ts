import { validate, Validator, IsLength } from "../../../index";

describe("IsLength", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsLength(0)], []).isValid).toBe(true);
    expect(validate([IsLength(0)], [1]).isValid).toBe(false);
    expect(validate([IsLength(0)], 1).isValid).toBe(false);

    expect(validate([IsLength(1)], []).isValid).toBe(false);
    expect(validate([IsLength(1)], [1]).isValid).toBe(true);
    expect(validate([IsLength(1)], [1, 2]).isValid).toBe(false);
    expect(validate([IsLength(1)], [1, 2, 3]).isValid).toBe(false);

    expect(validate([IsLength(1)], "bo").isValid).toBe(false);
    expect(validate([IsLength(2)], "bo").isValid).toBe(true);
    expect(validate([IsLength(3)], "bo").isValid).toBe(false);

    expect(validate([IsLength(5)], null).isValid).toBe(false);
    expect(validate([IsLength(5)], undefined).isValid).toBe(false);

    /* 2. ValidationError */

    // IsLength(length).validate(any)
    const vErrA = validate([IsLength(1)], "abc").error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" length to be equal to 1.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsLength", options: { length: 1 } },
    });

    // IsLength(length).validate(any, string, any)
    const vErrB = validate({ a: [IsLength(1)] }, { a: "abc" }).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "a" value, expected "abc" length to be equal to 1.`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsLength", options: { length: 1 } },
    });

    // IsLength(length, messageFn).validate(any)
    const messageFnC = ({ validator, value }) =>
      `Error at ${validator.name} with value ${JSON.stringify(value)}, options: ${JSON.stringify(validator.options)}.`;
    const vErrC = validate([IsLength(1, messageFnC)], "abc").error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsLength with value "abc", options: {"length":1}.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsLength", options: { length: 1 } },
    });

    // IsLength(length, messageFn).validate(any, string, any)
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsLength(1, messageFnD)] }, { a: "abc" }).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsLength Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsLength", options: { length: 1 } },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. length */
    const lengthErr = `Argument length should be a positive integer.`;

    expect(() => IsLength(null)).toThrow(lengthErr);

    /* 2. messageFn */
    const messageFnErr = `Argument messageFn should be a ValidationErrorMessageFn.`;

    // @ts-ignore
    expect(() => IsLength(123, 123)).toThrow(messageFnErr);
  });
});
