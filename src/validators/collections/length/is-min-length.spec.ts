import { validate, Validator, IsMinLength } from "../../../index";

describe("IsMinLength", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsMinLength(0)], []).isValid).toBe(true);
    expect(validate([IsMinLength(0)], [1]).isValid).toBe(true);
    expect(validate([IsMinLength(0)], 1).isValid).toBe(false);

    expect(validate([IsMinLength(1)], []).isValid).toBe(false);
    expect(validate([IsMinLength(1)], [1]).isValid).toBe(true);
    expect(validate([IsMinLength(1)], [1, 2]).isValid).toBe(true);
    expect(validate([IsMinLength(1)], [1, 2, 3]).isValid).toBe(true);

    expect(validate([IsMinLength(2)], "bo").isValid).toBe(true);
    expect(validate([IsMinLength(3)], "bo").isValid).toBe(false);

    expect(validate([IsMinLength(5)], null).isValid).toBe(false);
    expect(validate([IsMinLength(5)], undefined).isValid).toBe(false);

    /* 2. ValidationError */

    // IsMinLength(minLength).validate(any)
    const vErrA = validate([IsMinLength(5)], "abc").error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" length to be greater than or equal to 5.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsMinLength", options: { minLength: 5 } },
    });

    // IsMinLength(minLength).validate(any, string, any)
    const vErrB = validate({ a: [IsMinLength(5)] }, { a: "abc" }).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "a" value, expected "abc" length to be greater than or equal to 5.`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsMinLength", options: { minLength: 5 } },
    });

    // IsMinLength(minLength, messageFn).validate(any)
    const messageFnC = ({ validator, value }) =>
      `Error at ${validator.name} with value ${JSON.stringify(value)}, options: ${JSON.stringify(validator.options)}.`;
    const vErrC = validate([IsMinLength(5, messageFnC)], "abc").error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsMinLength with value "abc", options: {"minLength":5}.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsMinLength", options: { minLength: 5 } },
    });

    // IsMinLength(minLength, messageFn).validate(any, string, any)
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsMinLength(5, messageFnD)] }, { a: "abc" }).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsMinLength Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsMinLength", options: { minLength: 5 } },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. minLength */
    const minLengthErr = `Argument minLength should be a positive integer.`;

    expect(() => IsMinLength(null)).toThrow(minLengthErr);

    /* 2. messageFn */
    const messageFnErr = `Argument messageFn should be a ValidationErrorMessageFn.`;

    // @ts-ignore
    expect(() => IsMinLength(123, 123)).toThrow(messageFnErr);
  });
});
