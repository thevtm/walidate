import { validate, Validator, IsLessThan } from "../../index";

describe("IsLessThan", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsLessThan(true)], false).isValid).toBe(true);
    expect(validate([IsLessThan(true)], true).isValid).toBe(false);
    expect(validate([IsLessThan(false)], true).isValid).toBe(false);

    expect(validate([IsLessThan(0)], -1).isValid).toBe(true);
    expect(validate([IsLessThan(0)], 1).isValid).toBe(false);
    expect(validate([IsLessThan(10)], 11).isValid).toBe(false);
    expect(validate([IsLessThan(0)], 0).isValid).toBe(false);
    expect(validate([IsLessThan(Infinity)], 12).isValid).toBe(true);

    expect(validate([IsLessThan("b")], "a").isValid).toBe(true);
    expect(validate([IsLessThan("aaa")], "bbb").isValid).toBe(false);
    expect(validate([IsLessThan("avs")], "avs").isValid).toBe(false);

    expect(validate([IsLessThan(null)], undefined).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsLessThan().validate(any)
    const valueA = 465;
    const vErrA = validate([IsLessThan(100)], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected 465 to be less than 100.`,
      value: 465,
      propertyPath: undefined,
      target: 465,
      validator: {
        name: "IsLessThan",
        options: { value: 100 },
      },
    });

    // 2.2 IsLessThan().validate(any, string, any)
    const targetB = { age: "abc" };
    const vErrB = validate({ age: [IsLessThan("a")] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected "abc" to be less than "a".`,
      value: "abc",
      propertyPath: "age",
      target: { age: "abc" },
      validator: {
        name: "IsLessThan",
        options: { value: "a" },
      },
    });

    // 2.3 IsLessThan(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsLessThan(NaN, messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsLessThan with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: {
        name: "IsLessThan",
        options: { value: NaN },
      },
    });

    // 2.4 IsLessThan(messageFn).validate(any, string, any)
    const targetD = { a: "ffd" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsLessThan("bob", messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsLessThan Error at "a" with value "ffd".`,
      value: "ffd",
      propertyPath: "a",
      target: { a: "ffd" },
      validator: {
        name: "IsLessThan",
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
    expect(() => IsLessThan(123, 123)).toThrow(messageErr);
  });
});
