import { validate, Validator, IsObject } from "../../index";

describe("IsObject", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsObject()], {}).isValid).toBe(true);
    expect(validate([IsObject()], { a: {} }).isValid).toBe(true);
    expect(validate([IsObject()], { a: 1, b: 2, c: null }).isValid).toBe(true);

    expect(validate([IsObject()], new Date(1998, 12, 25)).isValid).toBe(true);
    expect(validate([IsObject()], [1, 2]).isValid).toBe(true);

    expect(validate([IsObject()], null).isValid).toBe(false);
    expect(validate([IsObject()], undefined).isValid).toBe(false);

    expect(validate([IsObject()], true).isValid).toBe(false);
    expect(validate([IsObject()], 123).isValid).toBe(false);
    expect(validate([IsObject()], "doia").isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsObject().validate(any)
    const valueA = "abc";
    const vErrA = validate([IsObject()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be an object.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsObject" },
    });

    // 2.2 IsObject().validate(any, string, any)
    const targetB = { age: null };
    const vErrB = validate({ age: [IsObject()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected null to be an object.`,
      value: null,
      propertyPath: "age",
      target: { age: null },
      validator: { name: "IsObject" },
    });

    // 2.3 IsObject(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsObject(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsObject with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsObject" },
    });

    // 2.4 IsObject(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsObject(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsObject Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsObject" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsObject(123)).toThrow(messageErr);
  });
});
