import { validate, IsGreaterThanOrEqual, Validator } from "../../index";

describe("IsGreaterThanOrEqual", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsGreaterThanOrEqual(false)], true).isValid).toBe(true);
    expect(validate([IsGreaterThanOrEqual(true)], true).isValid).toBe(true);

    expect(validate([IsGreaterThanOrEqual(0)], 0).isValid).toBe(true);
    expect(validate([IsGreaterThanOrEqual(0)], 1).isValid).toBe(true);
    expect(validate([IsGreaterThanOrEqual(0)], -1).isValid).toBe(false);
    expect(validate([IsGreaterThanOrEqual(10)], 11).isValid).toBe(true);
    expect(validate([IsGreaterThanOrEqual(12)], Infinity).isValid).toBe(true);

    expect(validate([IsGreaterThanOrEqual("avs")], "avs").isValid).toBe(true);
    expect(validate([IsGreaterThanOrEqual("aaa")], "bbb").isValid).toBe(true);

    expect(validate([IsGreaterThanOrEqual(null)], undefined).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsGreaterThanOrEqual().validate(any)
    const valueA = 41;
    const vErrA = validate([IsGreaterThanOrEqual(100)], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected 41 to be greater than or equal to 100.`,
      value: 41,
      propertyPath: undefined,
      target: 41,
      validator: {
        name: "IsGreaterThanOrEqual",
        options: { value: 100 },
      },
    });

    // 2.2 IsGreaterThanOrEqual().validate(any, string, any)
    const targetB = { age: "abc" };
    const vErrB = validate({ age: [IsGreaterThanOrEqual("f")] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected "abc" to be greater than or equal to "f".`,
      value: "abc",
      propertyPath: "age",
      target: { age: "abc" },
      validator: {
        name: "IsGreaterThanOrEqual",
        options: { value: "f" },
      },
    });

    // 2.3 IsGreaterThanOrEqual(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) =>
      `Error at ${validator.name} with value ${JSON.stringify(value)}, options: ${JSON.stringify(validator.options)}.`;
    const vErrC = validate([IsGreaterThanOrEqual("ff", messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsGreaterThanOrEqual with value "abc", options: {"value":"ff"}.`,
      value: valueC,
      propertyPath: undefined,
      target: "abc",
      validator: {
        name: "IsGreaterThanOrEqual",
        options: { value: "ff" },
      },
    });

    // 2.4 IsGreaterThanOrEqual(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsGreaterThanOrEqual("bob", messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsGreaterThanOrEqual Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: {
        name: "IsGreaterThanOrEqual",
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
    expect(() => IsGreaterThanOrEqual(123, 123)).toThrow(messageErr);
  });
});
