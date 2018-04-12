import { validate, Validator, IsGreaterThan } from "../../index";

describe("IsGreaterThan", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsGreaterThan(false)], true).isValid).toBe(true);
    expect(validate([IsGreaterThan(true)], true).isValid).toBe(false);

    expect(validate([IsGreaterThan(0)], 1).isValid).toBe(true);
    expect(validate([IsGreaterThan(0)], -1).isValid).toBe(false);
    expect(validate([IsGreaterThan(10)], 11).isValid).toBe(true);
    expect(validate([IsGreaterThan(0)], 0).isValid).toBe(false);
    expect(validate([IsGreaterThan(12)], Infinity).isValid).toBe(true);

    expect(validate([IsGreaterThan("aaa")], "bbb").isValid).toBe(true);
    expect(validate([IsGreaterThan("avs")], "avs").isValid).toBe(false);

    expect(validate([IsGreaterThan(null)], undefined).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsGreaterThan().validate(any)
    const valueA = 41;
    const vErrA = validate([IsGreaterThan(100)], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected 41 to be greater than 100.`,
      value: 41,
      propertyPath: undefined,
      target: 41,
      validator: {
        name: "IsGreaterThan",
        options: { value: 100 },
      },
    });

    // 2.2 IsGreaterThan().validate(any, string, any)
    const targetB = { age: "abc" };
    const vErrB = validate({ age: [IsGreaterThan("f")] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected "abc" to be greater than "f".`,
      value: "abc",
      propertyPath: "age",
      target: { age: "abc" },
      validator: {
        name: "IsGreaterThan",
        options: { value: "f" },
      },
    });

    // 2.3 IsGreaterThan(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) =>
      `Error at ${validator.name} with value ${JSON.stringify(value)}, options: ${JSON.stringify(validator.options)}.`;
    const vErrC = validate([IsGreaterThan("ff", messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsGreaterThan with value "abc", options: {"value":"ff"}.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: {
        name: "IsGreaterThan",
        options: { value: "ff" },
      },
    });

    // 2.4 IsGreaterThan(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsGreaterThan("bob", messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsGreaterThan Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: {
        name: "IsGreaterThan",
        options: { value: "bob" },
      },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. to */
    // not throw

    /* 2. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsGreaterThan(123, 123)).toThrow(messageErr);
  });
});
