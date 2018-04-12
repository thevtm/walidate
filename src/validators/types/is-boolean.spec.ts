import { validate, Validator, IsBoolean } from "../../index";

describe("IsBoolean", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsBoolean()], true).isValid).toBe(true);
    expect(validate([IsBoolean()], false).isValid).toBe(true);

    expect(validate([IsBoolean()], null).isValid).toBe(false);
    expect(validate([IsBoolean()], undefined).isValid).toBe(false);

    expect(validate([IsBoolean()], 123).isValid).toBe(false);
    expect(validate([IsBoolean()], "doia").isValid).toBe(false);
    expect(validate([IsBoolean()], new Date(1998, 12, 25)).isValid).toBe(false);
    expect(validate([IsBoolean()], [1, 2]).isValid).toBe(false);
    expect(validate([IsBoolean()], { a: 1, b: "foo" }).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsBoolean().validate(any)
    const valueA = "abc";
    const vErrA = validate([IsBoolean()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be a boolean.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsBoolean" },
    });

    // 2.2 IsBoolean().validate(any, string, any)
    const targetB = { age: null };
    const vErrB = validate({ age: [IsBoolean()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected null to be a boolean.`,
      value: null,
      propertyPath: "age",
      target: { age: null },
      validator: { name: "IsBoolean" },
    });

    // 2.3 IsBoolean(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsBoolean(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsBoolean with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsBoolean" },
    });

    // 2.4 IsBoolean(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsBoolean(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsBoolean Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsBoolean" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsBoolean(123)).toThrow(messageErr);
  });
});
