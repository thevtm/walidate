import { validate, Validator, IsNumber } from "../../index";

describe("IsNumber", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsNumber()], 0).isValid).toBe(true);
    expect(validate([IsNumber()], -322).isValid).toBe(true);
    expect(validate([IsNumber()], 412).isValid).toBe(true);

    expect(validate([IsNumber()], Infinity).isValid).toBe(true);
    expect(validate([IsNumber()], NaN).isValid).toBe(true);

    expect(validate([IsNumber()], null).isValid).toBe(false);
    expect(validate([IsNumber()], undefined).isValid).toBe(false);

    expect(validate([IsNumber()], true).isValid).toBe(false);
    expect(validate([IsNumber()], "doia").isValid).toBe(false);
    expect(validate([IsNumber()], new Date(1998, 12, 25)).isValid).toBe(false);
    expect(validate([IsNumber()], [1, 2]).isValid).toBe(false);
    expect(validate([IsNumber()], { a: 1, b: "foo" }).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsNumber().validate(any)
    const valueA = "abc";
    const vErrA = validate([IsNumber()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be a number.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsNumber" },
    });

    // 2.2 IsNumber().validate(any, string, any)
    const targetB = { age: true };
    const vErrB = validate({ age: [IsNumber()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected true to be a number.`,
      value: true,
      propertyPath: "age",
      target: { age: true },
      validator: { name: "IsNumber" },
    });

    // 2.3 IsNumber(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsNumber(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsNumber with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsNumber" },
    });

    // 2.4 IsNumber(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsNumber(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsNumber Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsNumber" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsNumber(123)).toThrow(messageErr);
  });
});
