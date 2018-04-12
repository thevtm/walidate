import { validate, Validator, IsEmpty } from "../../../index";

describe("IsEmpty", () => {
  it("validate() should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsEmpty()], true).isValid).toBe(true);
    expect(validate([IsEmpty()], 0).isValid).toBe(true);
    expect(validate([IsEmpty()], "").isValid).toBe(true);
    expect(validate([IsEmpty()], "abc").isValid).toBe(false);
    expect(validate([IsEmpty()], new Date(1998, 12, 25)).isValid).toBe(true);
    expect(validate([IsEmpty()], []).isValid).toBe(true);
    expect(validate([IsEmpty()], [1]).isValid).toBe(false);
    expect(validate([IsEmpty()], { a: 1, b: "foo" }).isValid).toBe(false);

    expect(validate([IsEmpty()], null).isValid).toBe(true);
    expect(validate([IsEmpty()], undefined).isValid).toBe(true);

    /* 2. ValidationError */

    // 2.1 IsEmpty().validate(any)
    const valueA = "abc";
    const vErrA = validate([IsEmpty()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be empty.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: {
        name: "IsEmpty",
      },
    });

    // 2.2 IsEmpty().validate(any, string, any)
    const targetB = { age: [0] };
    const vErrB = validate({ age: [IsEmpty()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected [0] to be empty.`,
      value: [0],
      propertyPath: "age",
      target: { age: [0] },
      validator: {
        name: "IsEmpty",
      },
    });

    // 2.3 IsEmpty(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsEmpty(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsEmpty with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: {
        name: "IsEmpty",
      },
    });

    // 2.4 IsEmpty(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsEmpty(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsEmpty Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: {
        name: "IsEmpty",
      },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsEmpty(123)).toThrow(messageErr);
  });
});
