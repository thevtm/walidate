import { validate, Validator, IsDefined } from "../../index";

describe("IsDefined", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsDefined()], true).isValid).toBe(true);
    expect(validate([IsDefined()], 123).isValid).toBe(true);
    expect(validate([IsDefined()], "doia").isValid).toBe(true);
    expect(validate([IsDefined()], new Date(1998, 12, 25)).isValid).toBe(true);
    expect(validate([IsDefined()], [1, 2]).isValid).toBe(true);
    expect(validate([IsDefined()], { a: 1, b: "foo" }).isValid).toBe(true);

    expect(validate([IsDefined()], null).isValid).toBe(false);
    expect(validate([IsDefined()], undefined).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsDefined().validate(any)
    const valueA = undefined;
    const vErrA = validate([IsDefined()], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected undefined to be defined.`,
      value: undefined,
      propertyPath: undefined,
      target: undefined,
      validator: { name: "IsDefined" },
    });

    // 2.2 IsDefined().validate(any, string, any)
    const targetB = { age: null };
    const vErrB = validate({ age: [IsDefined()] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected null to be defined.`,
      value: null,
      propertyPath: "age",
      target: { age: null },
      validator: { name: "IsDefined" },
    });

    // 2.3 IsDefined(messageFn).validate(any)
    const valueC = null;
    const messageFnC = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrC = validate([IsDefined(messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsDefined with value null.`,
      value: null,
      propertyPath: undefined,
      target: null,
      validator: { name: "IsDefined" },
    });

    // 2.4 IsDefined(messageFn).validate(any, string, any)
    const targetD = { a: null };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsDefined(messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsDefined Error at "a" with value null.`,
      value: null,
      propertyPath: "a",
      target: { a: null },
      validator: { name: "IsDefined" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsDefined(123)).toThrow(messageErr);
  });
});
