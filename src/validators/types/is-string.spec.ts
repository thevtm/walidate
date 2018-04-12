import { validate, Validator, IsString } from "../../index";

describe("IsString", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsString()], "").isValid).toBe(true);
    expect(validate([IsString()], "a").isValid).toBe(true);
    expect(validate([IsString()], "ab23").isValid).toBe(true);

    expect(validate([IsString()], null).isValid).toBe(false);
    expect(validate([IsString()], undefined).isValid).toBe(false);

    expect(validate([IsString()], true).isValid).toBe(false);
    expect(validate([IsString()], 123).isValid).toBe(false);
    expect(validate([IsString()], new Date(1998, 12, 25)).isValid).toBe(false);
    expect(validate([IsString()], [1, 2]).isValid).toBe(false);
    expect(validate([IsString()], { a: 1, b: "foo" }).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsString().validate(any)
    const valueA = 123;
    const vErrA = validate([IsString()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected 123 to be a string.`,
      value: 123,
      propertyPath: undefined,
      target: 123,
      validator: { name: "IsString" },
    });

    // 2.2 IsString().validate(any, string, any)
    const targetB = { age: null };
    const vErrB = validate({ age: [IsString()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected null to be a string.`,
      value: null,
      propertyPath: "age",
      target: { age: null },
      validator: { name: "IsString" },
    });

    // 2.3 IsString(messageFn).validate(any)
    const valueC = ["abc"];
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsString(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsString with value ["abc"].`,
      value: ["abc"],
      propertyPath: undefined,
      target: ["abc"],
      validator: { name: "IsString" },
    });

    // 2.4 IsString(messageFn).validate(any, string, any)
    const targetD = { a: null };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsString(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsString Error at "a" with value null.`,
      value: null,
      propertyPath: "a",
      target: { a: null },
      validator: { name: "IsString" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsString(123)).toThrow(messageErr);
  });
});
