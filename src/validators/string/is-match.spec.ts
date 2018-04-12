import { validate, Validator, IsMatch } from "../../index";

describe("IsMatch", () => {
  it("should return a Validator according to spec", () => {
    /* 1. Validation */

    expect(validate([IsMatch(/abc/)], "abc").isValid).toBe(true);
    expect(validate([IsMatch(/abc/)], "bac").isValid).toBe(false);

    expect(validate([IsMatch(/pop/)], 123).isValid).toBe(false);
    expect(validate([IsMatch(/bom/)], [1, 2, 3]).isValid).toBe(false);
    expect(validate([IsMatch(/bob/)], { foo: 12 }).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsMatch().validate(any)
    const vErrA = validate([IsMatch(/foo/)], "abc").error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to match pattern /foo/.`,
      value: "abc",
      propertyPath: undefined,
      target: "abc",
      validator: {
        name: "IsMatch",
        options: { pattern: /foo/ },
      },
    });

    // 2.2 IsMatch().validate(any, string, any)
    const patternB = /bob/;
    const targetB = { age: "zz" };
    const vErrB = validate({ age: [IsMatch(patternB)] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected "zz" to match pattern /bob/.`,
      value: targetB.age,
      propertyPath: "age",
      target: targetB,
      validator: {
        name: "IsMatch",
        options: { pattern: patternB },
      },
    });

    // 2.3 IsMatch(messageFn).validate(any)
    const patternC = /abc/;
    const valueC = "F";
    const messageFnC = ({ validator, value }) =>
      `Error at ${validator.name} with value ${JSON.stringify(value)}, options: ${JSON.stringify(validator.options)}.`;
    const vErrC = validate([IsMatch(patternC, messageFnC)], valueC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Error at IsMatch with value "F", options: {"pattern":{}}.`,
      value: valueC,
      propertyPath: undefined,
      target: "F",
      validator: {
        name: "IsMatch",
        options: { pattern: patternC },
      },
    });

    // 2.4 IsMatch(messageFn).validate(any, string, any)
    const patternD = /foo/;
    const targetD = { a: ["abc"] };
    const messageFnD = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrD = validate({ a: [IsMatch(patternD, messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `IsMatch Error at "a" with value ["abc"].`,
      value: targetD.a,
      propertyPath: "a",
      target: targetD,
      validator: {
        name: "IsMatch",
        options: { pattern: patternD },
      },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. pattern */
    const valuesErr = new TypeError(`Argument values should be an regular expression.`);

    // @ts-ignore
    expect(() => IsMatch(123)).toThrow(valuesErr);

    /* 2. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsMatch(/foo/, 123)).toThrow(messageErr);
  });
});
