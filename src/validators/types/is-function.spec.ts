import { validate, Validator, IsFunction } from "../../index";

describe("IsFunction", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsFunction()], () => null).isValid).toBe(true);

    expect(validate([IsFunction()], null).isValid).toBe(false);
    expect(validate([IsFunction()], undefined).isValid).toBe(false);

    expect(validate([IsFunction()], true).isValid).toBe(false);
    expect(validate([IsFunction()], 123).isValid).toBe(false);
    expect(validate([IsFunction()], "doia").isValid).toBe(false);
    expect(validate([IsFunction()], new Date(1998, 12, 25)).isValid).toBe(false);
    expect(validate([IsFunction()], [1, 2]).isValid).toBe(false);
    expect(validate([IsFunction()], { a: 1, b: "foo" }).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsFunction().validate(any)
    const valueA = "abc";
    const vErrA = validate([IsFunction()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be a function.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsFunction" },
    });

    // 2.2 IsFunction().validate(any, string, any)
    const targetB = { age: null };
    const vErrB = validate({ age: [IsFunction()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected null to be a function.`,
      value: null,
      propertyPath: "age",
      target: { age: null },
      validator: { name: "IsFunction" },
    });

    // 2.3 IsFunction(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsFunction(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsFunction with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsFunction" },
    });

    // 2.4 IsFunction(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsFunction(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsFunction Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsFunction" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsFunction(123)).toThrow(messageErr);
  });
});
