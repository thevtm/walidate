import { validate, Validator, IsIn } from "../../../index";

describe("IsIn", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsIn([])], 1).isValid).toBe(false);

    expect(validate([IsIn([true])], true).isValid).toBe(true);
    expect(validate([IsIn([true])], false).isValid).toBe(false);

    expect(validate([IsIn([0, 1, 2])], 1).isValid).toBe(true);
    expect(validate([IsIn([0, 1, 2])], 3).isValid).toBe(false);

    expect(validate([IsIn(["a", "bcs", "goo"])], "bcs").isValid).toBe(true);
    expect(validate([IsIn(["a", "bcs", "goo"])], "foo").isValid).toBe(false);

    expect(validate([IsIn([null, undefined])], null).isValid).toBe(true);
    expect(validate([IsIn([null, undefined])], NaN).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsIn().validate(any)
    const vErrA = validate([IsIn([true])], "abc").error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be in [true].`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: {
        name: "IsIn",
        options: { values: [true] },
      },
    });

    // 2.2 IsIn().validate(any, string, any)
    const valuesB = [1, 2, 3];
    const targetB = { age: 0 };

    const vErrB = validate({ age: [IsIn(valuesB)] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected 0 to be in [1,2,3].`,
      value: 0,
      propertyPath: "age",
      target: { age: 0 },
      validator: {
        name: "IsIn",
        options: { values: [1, 2, 3] },
      },
    });

    // 2.3 IsIn(messageFn).validate(any)
    const valueC = "F";
    const valuesC = ["a", "b", "c"];
    const messageFnC = ({ validator, value }) =>
      `Error at ${validator.name} with value ${JSON.stringify(value)}, options: ${JSON.stringify(validator.options)}.`;
    const vErrC = validate([IsIn(valuesC, messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsIn with value "F", options: {"values":["a","b","c"]}.`,
      value: "F",
      propertyPath: undefined,
      target: "F",
      validator: {
        name: "IsIn",
        options: { values: ["a", "b", "c"] },
      },
    });

    // 2.4 IsIn(messageFn).validate(any, string, any)
    const valuesD = [null];
    const targetD = { a: ["abc"] };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsIn(valuesD, messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsIn Error at "a" with value ["abc"].`,
      value: targetD.a,
      propertyPath: "a",
      target: targetD,
      validator: {
        name: "IsIn",
        options: { values: valuesD },
      },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. values */
    const valuesErr = new TypeError(`Argument values should be an array.`);

    // @ts-ignore
    expect(() => IsIn(123)).toThrow(valuesErr);

    /* 2. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsIn([], 123)).toThrow(messageErr);
  });
});
