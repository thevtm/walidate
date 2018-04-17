import { validate, Validator, IsMaxLength } from "../../../index";

describe("IsMaxLength", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsMaxLength(0)], []).isValid).toBe(true);
    expect(validate([IsMaxLength(0)], [1]).isValid).toBe(false);
    expect(validate([IsMaxLength(0)], 1).isValid).toBe(false);

    expect(validate([IsMaxLength(1)], []).isValid).toBe(true);
    expect(validate([IsMaxLength(1)], [1]).isValid).toBe(true);
    expect(validate([IsMaxLength(1)], [1, 2]).isValid).toBe(false);
    expect(validate([IsMaxLength(1)], [1, 2, 3]).isValid).toBe(false);

    expect(validate([IsMaxLength(1)], "bo").isValid).toBe(false);
    expect(validate([IsMaxLength(2)], "bo").isValid).toBe(true);
    expect(validate([IsMaxLength(3)], "bo").isValid).toBe(true);

    expect(validate([IsMaxLength(5)], null).isValid).toBe(false);
    expect(validate([IsMaxLength(5)], undefined).isValid).toBe(false);

    /* 2. ValidationError */

    // IsMaxLength(maxLength).validate(any)
    const vErrA = validate([IsMaxLength(1)], "abc").error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" length to be greater than or equal to 1.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsMaxLength", options: { maxLength: 1 } },
    });

    // IsMaxLength(maxLength).validate(any, string, any)
    const vErrB = validate({ a: [IsMaxLength(1)] }, { a: "abc" }).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "a" value, expected "abc" length to be greater than or equal to 1.`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsMaxLength", options: { maxLength: 1 } },
    });

    // IsMaxLength(maxLength, messageFn).validate(any)
    const messageFnC = ({ validator, value }) =>
      `Error at ${validator.name} with value ${JSON.stringify(value)}, options: ${JSON.stringify(validator.options)}.`;
    const vErrC = validate([IsMaxLength(1, messageFnC)], "abc").error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsMaxLength with value "abc", options: {"maxLength":1}.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsMaxLength", options: { maxLength: 1 } },
    });

    // IsMaxLength(maxLength, messageFn).validate(any, string, any)
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsMaxLength(1, messageFnD)] }, { a: "abc" }).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsMaxLength Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsMaxLength", options: { maxLength: 1 } },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. maxLength */
    const maxLengthErr = `Argument maxLength should be a positive integer.`;

    expect(() => IsMaxLength(null)).toThrow(maxLengthErr);

    /* 2. messageFn */
    const messageFnErr = `Argument messageFn should be a ValidationErrorMessageFn.`;

    // @ts-ignore
    expect(() => IsMaxLength(123, 123)).toThrow(messageFnErr);
  });
});
