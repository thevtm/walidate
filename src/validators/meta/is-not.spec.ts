import { validate, Validator, IsEmpty, IsNumber, IsOptional, IsArray, IsNot } from "../../index";

describe("IsNot", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsNot([IsNumber()])], "abc").isValid).toBe(true);
    expect(validate([IsNot([IsNumber()])], 0).isValid).toBe(false);

    expect(validate([IsNot([IsEmpty()])], [1, 2]).isValid).toBe(true);
    expect(validate([IsNot([IsEmpty()])], []).isValid).toBe(false);
    expect(validate([IsNot([IsArray(), IsEmpty()])], [0]).isValid).toBe(true);

    expect(validate([IsNot([IsOptional(), IsNumber()])], null).isValid).toBe(false);
    expect(validate([IsNot([IsOptional(), IsNumber()])], 32).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsNot(Validator[]).validate(any)
    const valueA = "abc";
    const vErrA = validate([IsNot([IsOptional()])], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be valid.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsNot" },
    });

    // 2.2 IsNot(Validator[]).validate(any, string, any)
    const targetB = { age: true };
    const vErrB = validate({ age: [IsNot([IsOptional()])] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected true to be valid.`,
      value: true,
      propertyPath: "age",
      target: { age: true },
      validator: { name: "IsNot" },
    });

    // 2.3 IsNot(messageFn).validate(any)
    const valueC = 1;
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsNot([IsNumber()], messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsNot with value 1.`,
      value: 1,
      propertyPath: undefined,
      target: 1,
      validator: { name: "IsNot" },
    });

    // 2.4 IsNot(messageFn).validate(any, string, any)
    const targetD = { a: "" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsNot([IsEmpty()], messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsNot Error at "a" with value "".`,
      value: "",
      propertyPath: "a",
      target: { a: "" },
      validator: { name: "IsNot" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. validators */
    const validatorsErr = new TypeError(`Argument validators should be a non empty Validator[].`);

    // @ts-ignore
    expect(() => IsNot()).toThrow(validatorsErr);
    // @ts-ignore
    expect(() => IsNot([])).toThrow(validatorsErr);
    // @ts-ignore
    expect(() => IsNot("abc")).toThrow(validatorsErr);

    /* 2. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsNot([IsEmpty()], 123)).toThrow(messageErr);

    /* 3. name */
    const nameErr = new TypeError(`Argument name should be a non empty string.`);

    // @ts-ignore
    expect(() => IsNot([IsEmpty()], () => "Error!", 123)).toThrow(nameErr);
  });
});
