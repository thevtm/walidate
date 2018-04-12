import { validate, Validator, IsFinite } from "../../index";

describe("IsFinite", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsFinite()], 0).isValid).toBe(true);
    expect(validate([IsFinite()], 113213).isValid).toBe(true);
    expect(validate([IsFinite()], -131).isValid).toBe(true);
    expect(validate([IsFinite()], 1.1).isValid).toBe(true);
    expect(validate([IsFinite()], NaN).isValid).toBe(false);
    expect(validate([IsFinite()], Infinity).isValid).toBe(false);

    expect(validate([IsFinite()], null).isValid).toBe(false);
    expect(validate([IsFinite()], undefined).isValid).toBe(false);

    expect(validate([IsFinite()], true).isValid).toBe(false);
    expect(validate([IsFinite()], "doia").isValid).toBe(false);
    expect(validate([IsFinite()], new Date(1998, 12, 25)).isValid).toBe(false);
    expect(validate([IsFinite()], [1, 2]).isValid).toBe(false);
    expect(validate([IsFinite()], { a: 1, b: "foo" }).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsFinite().validate(any)
    const valueA = "abc";
    const vErrA = validate([IsFinite()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be a finite number.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsFinite" },
    });

    // 2.2 IsFinite().validate(any, string, any)
    const targetB = { age: null };
    const vErrB = validate({ age: [IsFinite()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected null to be a finite number.`,
      value: null,
      propertyPath: "age",
      target: { age: null },
      validator: { name: "IsFinite" },
    });

    // 2.3 IsFinite(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsFinite(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsFinite with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsFinite" },
    });

    // 2.4 IsFinite(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsFinite(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsFinite Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsFinite" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsFinite(123)).toThrow(messageErr);
  });
});
