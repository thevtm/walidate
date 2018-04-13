import { validate, Validator, IsInstanceOf } from "../../index";

describe("IsInstanceOf", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsInstanceOf(Date)], new Date("1/1/1999")).isValid).toBe(true);
    expect(validate([IsInstanceOf(Date)], true).isValid).toBe(false);

    expect(validate([IsInstanceOf(Validator)], IsInstanceOf(Number)).isValid).toBe(true);
    expect(validate([IsInstanceOf(Validator)], "fisjdis").isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsInstanceOf().validate(any)
    const valueA = "abc";
    const classTypeA = Number;
    const vErrA = validate([IsInstanceOf(classTypeA)], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be an instance of Number.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsInstanceOf", options: { classType: Number } },
    });

    // 2.2 IsInstanceOf().validate(any, string, any)
    const targetB = { age: null };
    const classTypeB = Validator;
    const vErrB = validate({ age: [IsInstanceOf(classTypeB)] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected null to be an instance of Validator.`,
      value: null,
      propertyPath: "age",
      target: { age: null },
      validator: { name: "IsInstanceOf", options: { classType: Validator } },
    });

    // 2.3 IsInstanceOf(messageFn).validate(any)
    const valueC = "abc";
    const classTypeC = Boolean;
    const messageFnC = ({ validator, value }) =>
      `Error at ${validator.name} with value ${JSON.stringify(value)}, options: ${JSON.stringify(validator.options)}.`;
    const vErrC = validate([IsInstanceOf(classTypeC, messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsInstanceOf with value "abc", options: {}.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsInstanceOf", options: { classType: Boolean } },
    });

    // 2.4 IsInstanceOf(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const classTypeD = Number;
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsInstanceOf(classTypeD, messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsInstanceOf Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsInstanceOf", options: { classType: Number } },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. classType */
    // not throw

    /* 2. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsInstanceOf(123, 123)).toThrow(messageErr);
  });
});
