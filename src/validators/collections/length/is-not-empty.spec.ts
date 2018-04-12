import { validate, Validator, IsNotEmpty } from "../../../index";

describe("IsEmpty", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsNotEmpty()], true).isValid).toBe(false);
    expect(validate([IsNotEmpty()], 0).isValid).toBe(false);
    expect(validate([IsNotEmpty()], "").isValid).toBe(false);
    expect(validate([IsNotEmpty()], [1]).isValid).toBe(true);
    expect(validate([IsNotEmpty()], { a: 1, b: "foo" }).isValid).toBe(true);

    expect(validate([IsNotEmpty()], null).isValid).toBe(false);
    expect(validate([IsNotEmpty()], undefined).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsNotEmpty().validate(any)
    const valueA = "";
    const vErrA = validate([IsNotEmpty()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "" to not be empty.`,
      value: "",
      propertyPath: undefined,
      target: "",
      validator: {
        name: "IsNotEmpty",
      },
    });

    // 2.2 IsNotEmpty().validate(any, string, any)
    const targetB = { age: [] };
    const vErrB = validate({ age: [IsNotEmpty()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected [] to not be empty.`,
      value: [],
      propertyPath: "age",
      target: { age: [] },
      validator: {
        name: "IsNotEmpty",
      },
    });

    // 2.3 IsNotEmpty(messageFn).validate(any)
    const valueC = "";
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsNotEmpty(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsNotEmpty with value "".`,
      value: "",
      propertyPath: undefined,
      target: "",
      validator: {
        name: "IsNotEmpty",
      },
    });

    // 2.4 IsNotEmpty(messageFn).validate(any, string, any)
    const targetD = { a: [] };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsNotEmpty(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsNotEmpty Error at "a" with value [].`,
      value: [],
      propertyPath: "a",
      target: { a: [] },
      validator: {
        name: "IsNotEmpty",
      },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsNotEmpty(123)).toThrow(messageErr);
  });
});
