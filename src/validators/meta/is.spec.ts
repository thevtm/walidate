import {
  Validator,
  IsNumber,
  IsOptional,
  IsArray,
  Is,
  validate,
  IsString,
  IsArrayOf,
  IsGreaterThan,
} from "../../index";

describe("Is", () => {
  it("should return a Validator according to spec", () => {
    /* Validation logic */

    expect(validate([Is([IsNumber()])], 3).isValid).toBe(true);
    expect(validate([Is([IsNumber()])], "a").isValid).toBe(false);

    expect(validate([Is([IsNumber(), IsGreaterThan(3)])], 5).isValid).toBe(true);
    expect(validate([Is([IsNumber(), IsGreaterThan(3)])], 0).isValid).toBe(false);

    expect(validate([Is({ a: [IsNumber()] })], { a: 3 }).isValid).toBe(true);
    expect(validate([Is({ a: [IsNumber()] })], "foo").isValid).toBe(false);

    expect(validate([IsArrayOf([Is({ a: [IsNumber()] })])], [{ a: 1 }, { a: 2 }]).isValid).toBe(true);
    expect(validate([IsArrayOf([Is({ a: [IsNumber()] })])], [{ a: 1 }, { a: "f" }]).isValid).toBe(false);

    /* ValidationError */

    // Is(constraints).validate(any)
    const valueA = "abc";
    const vErrA = validate([Is({ a: [IsNumber()] })], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid property "a" value, expected undefined to be a number.`,
      value: undefined,
      propertyPath: "a",
      target: "abc",
      validator: { name: "IsNumber" },
    });

    // Is(validators, messageFn).validate(any)
    const valueB = "bob";
    const messageFnC = ({ validator, value }) =>
      `Error at ${validator.name}: ${JSON.stringify(value)} should be a number.`;
    const vErrB = validate([Is([IsNumber()], messageFnC)], valueB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Error at Is: "bob" should be a number.`,
      value: "bob",
      propertyPath: undefined,
      target: "bob",
      validator: {
        name: "Is",
      },
    });

    // Is(validators).validate(any, string, any)
    const targetC = { a: true };
    const vErrC = validate({ a: [Is([IsString()])] }, targetC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Invalid property "a" value, expected true to be a string.`,
      value: true,
      propertyPath: "a",
      target: { a: true },
      validator: { name: "IsString" },
    });

    // Is(constraints, messageFn).validate(any, propertyPath, target)
    const targetD = { a: { b: "Foo" } };
    const messageFnD = ({ validator, value, propertyPath, target }) =>
      `Error at ${validator.name}: "${propertyPath}" ${JSON.stringify(value)} should be a number.`;
    const vErrD = validate({ a: [Is({ b: [IsNumber()] }, messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `Error at Is: "a" {"b":"Foo"} should be a number.`,
      value: { b: "Foo" },
      propertyPath: "a",
      target: { a: { b: "Foo" } },
      validator: { name: "Is" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. constraints */
    const constraintsErr = new TypeError(`Argument input should be an Validator[] or Constraints.`);

    // @ts-ignore
    expect(() => Is()()).toThrow(constraintsErr);
    // @ts-ignore
    expect(() => Is([])()).toThrow(constraintsErr);
    // @ts-ignore
    expect(() => Is({})()).toThrow(constraintsErr);
    // @ts-ignore
    expect(() => Is("abc")()).toThrow(constraintsErr);
  });
});
