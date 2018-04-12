import { validate, Validator, IsDate } from "../../index";

describe("IsDate", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsDate()], new Date(1998, 12, 25)).isValid).toBe(true);

    expect(validate([IsDate()], null).isValid).toBe(false);
    expect(validate([IsDate()], undefined).isValid).toBe(false);

    expect(validate([IsDate()], true).isValid).toBe(false);
    expect(validate([IsDate()], 123).isValid).toBe(false);
    expect(validate([IsDate()], "boo").isValid).toBe(false);
    expect(validate([IsDate()], [1, 2]).isValid).toBe(false);
    expect(validate([IsDate()], { a: 1, b: "foo" }).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsDate().validate(any)
    const valueA = "abc";
    const vErrA = validate([IsDate()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be a date.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsDate" },
    });

    // 2.2 IsDate().validate(any, string, any)
    const targetB = { age: null };
    const vErrB = validate({ age: [IsDate()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected null to be a date.`,
      value: null,
      propertyPath: "age",
      target: { age: null },
      validator: { name: "IsDate" },
    });

    // 2.3 IsDate(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsDate(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsDate with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsDate" },
    });

    // 2.4 IsDate(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsDate(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsDate Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsDate" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsDate(123)).toThrow(messageErr);
  });
});
