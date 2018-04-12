import { validate, Validator, IsArray } from "../../index";

describe("IsArray", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsArray()], []).isValid).toBe(true);
    expect(validate([IsArray()], [1]).isValid).toBe(true);
    expect(validate([IsArray()], [1, 2]).isValid).toBe(true);
    expect(validate([IsArray()], ["array"]).isValid).toBe(true);

    expect(validate([IsArray()], null).isValid).toBe(false);
    expect(validate([IsArray()], undefined).isValid).toBe(false);

    expect(validate([IsArray()], true).isValid).toBe(false);
    expect(validate([IsArray()], 1).isValid).toBe(false);
    expect(validate([IsArray()], "doia").isValid).toBe(false);
    expect(validate([IsArray()], new Date(1998, 12, 25)).isValid).toBe(false);
    expect(validate([IsArray()], { a: 1, b: "foo" }).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsError().validate(any)
    const valueA = "abc";
    const vErrA = validate([IsArray()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be an array.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsArray" },
    });

    // 2.2 IsError().validate(any, string, any)
    const targetB = { age: true };
    const vErrB = validate({ age: [IsArray()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected true to be an array.`,
      value: true,
      propertyPath: "age",
      target: { age: true },
      validator: { name: "IsArray" },
    });

    // 2.3 IsArray(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsArray(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsArray with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsArray" },
    });

    // 2.4 IsArray(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsArray(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsArray Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsArray" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsArray(123)).toThrow(messageErr);
  });
});
