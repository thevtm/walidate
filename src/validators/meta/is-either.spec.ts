import { validate, Validator, IsOptional, IsNumber, IsArray, IsEither } from "../../index";

describe("IsEither", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsEither([[IsNumber()]])], 12).isValid).toBe(true);
    expect(validate([IsEither([[IsArray()]])], 12).isValid).toBe(false);

    expect(validate([IsEither([[IsNumber()], [IsArray()]])], 12).isValid).toBe(true);
    expect(validate([IsEither([[IsNumber()], [IsArray()]])], []).isValid).toBe(true);
    expect(validate([IsEither([[IsNumber()], [IsArray()]])], "abc").isValid).toBe(false);

    expect(validate([IsEither([[IsNumber()], [IsOptional(), IsArray()]])], null).isValid).toBe(true);
    expect(validate([IsEither([[IsNumber()], [IsOptional(), IsArray()]])], []).isValid).toBe(true);
    expect(validate([IsEither([[IsNumber()], [IsOptional(), IsArray()]])], "a").isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsEither(validators).validate(any)
    const valueA = "abc";
    const vErrA = validate([IsEither([[IsNumber()], [IsArray()]])], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be valid.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsEither" },
    });

    // 2.2 IsEither(validators).validate(any, string, any)
    const targetB = { age: true };
    const vErrB = validate({ age: [IsEither([[IsNumber()], [IsArray()]])] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected true to be valid.`,
      value: true,
      propertyPath: "age",
      target: { age: true },
      validator: { name: "IsEither" },
    });

    // 2.3 IsEither(messageFn).validate(any)
    const valueC = "abc";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsEither([[IsNumber()], [IsArray()]], messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsEither with value "abc".`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: { name: "IsEither" },
    });

    // 2.4 IsEither(messageFn).validate(any, string, any)
    const targetD = { a: "abc" };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsEither([[IsNumber()], [IsArray()]], messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsEither Error at "a" with value "abc".`,
      value: "abc",
      propertyPath: "a",
      target: { a: "abc" },
      validator: { name: "IsEither" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. arrayOfValidators */
    const validatorsErr = new TypeError(`Argument arrayOfValidators should be a non empty Validator[][].`);

    // @ts-ignore
    expect(() => IsEither()).toThrow(validatorsErr);
    // @ts-ignore
    expect(() => IsEither([])).toThrow(validatorsErr);
    // @ts-ignore
    expect(() => IsEither("abc")).toThrow(validatorsErr);
    // @ts-ignore
    expect(() => IsEither([IsArray()])).toThrow(validatorsErr);
    // @ts-ignore
    expect(() => IsEither([[IsArray()], []])).toThrow(validatorsErr);
    // @ts-ignore
    expect(() => IsEither([[IsArray()], [IsNumber(), "foo"]])).toThrow(validatorsErr);

    /* 2. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsEither([[IsArray()]], 123)).toThrow(messageErr);

    /* 3. name */
    const nameErr = new TypeError(`Argument name should be a non empty string.`);

    // @ts-ignore
    expect(() => IsEither([[IsArray()]], () => "Error!", 123)).toThrow(nameErr);
  });
});
