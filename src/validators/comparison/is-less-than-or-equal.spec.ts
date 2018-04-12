import { validate, IsLessThanOrEqual, Validator } from "../../index";

describe("IsLessThanOrEqual", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsLessThanOrEqual(true)], true).isValid).toBe(true);
    expect(validate([IsLessThanOrEqual(true)], false).isValid).toBe(true);
    expect(validate([IsLessThanOrEqual(false)], true).isValid).toBe(false);

    expect(validate([IsLessThanOrEqual(0)], 0).isValid).toBe(true);
    expect(validate([IsLessThanOrEqual(0)], -1).isValid).toBe(true);
    expect(validate([IsLessThanOrEqual(0)], 1).isValid).toBe(false);
    expect(validate([IsLessThanOrEqual(10)], 11).isValid).toBe(false);
    expect(validate([IsLessThanOrEqual(Infinity)], 12).isValid).toBe(true);

    expect(validate([IsLessThanOrEqual("avs")], "avs").isValid).toBe(true);
    expect(validate([IsLessThanOrEqual("b")], "a").isValid).toBe(true);
    expect(validate([IsLessThanOrEqual("aaa")], "bbb").isValid).toBe(false);

    expect(validate([IsLessThanOrEqual(null)], undefined).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsLessThanOrEqual().validate(any)
    const valueA = 41;
    const vErrA = validate([IsLessThanOrEqual(0)], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected 41 to be less than or equal to 0.`,
      value: 41,
      propertyPath: undefined,
      target: 41,
      validator: {
        name: "IsLessThanOrEqual",
        options: { value: 0 },
      },
    });

    // 2.2 IsLessThanOrEqual().validate(any, string, any)
    const targetB = { age: "abc" };
    const vErrB = validate({ age: [IsLessThanOrEqual("0")] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected "abc" to be less than or equal to "0".`,
      value: targetB.age,
      propertyPath: "age",
      target: targetB,
      validator: {
        name: "IsLessThanOrEqual",
        options: { value: "0" },
      },
    });

    // 2.3 IsLessThanOrEqual(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) =>
      `Error at ${validator.name} with value ${JSON.stringify(value)}, options: ${JSON.stringify(validator.options)}.`;
    const vErrC = validate([IsLessThanOrEqual("0", messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsLessThanOrEqual with value "abc", options: {"value":"0"}.`,
      value: valueC,
      propertyPath: undefined,
      target: "abc",
      validator: {
        name: "IsLessThanOrEqual",
        options: { value: "0" },
      },
    });

    // 2.4 IsLessThanOrEqual(messageFn).validate(any, string, any)
    const targetD = { a: "fabc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsLessThanOrEqual("bob", messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsLessThanOrEqual Error at "a" with value "fabc".`,
      value: "fabc",
      propertyPath: "a",
      target: targetD,
      validator: {
        name: "IsLessThanOrEqual",
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
    expect(() => IsLessThanOrEqual(123, 123)).toThrow(messageErr);
  });
});
