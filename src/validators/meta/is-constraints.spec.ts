import { Validator, IsNumber, IsOptional, IsArray, IsConstraints, validate, IsString, IsArrayOf } from "../../index";

describe("IsConstraints", () => {
  it("should return a Validator according to spec", () => {
    /* Validation logic */

    expect(validate([IsConstraints({ a: [IsNumber()] })], { a: 3 }).isValid).toBe(true);
    expect(validate([IsConstraints({ a: [IsNumber()] })], "foo").isValid).toBe(false);

    expect(validate([IsArrayOf([IsConstraints({ a: [IsNumber()] })])], [{ a: 1 }, { a: 2 }]).isValid).toBe(true);
    expect(validate([IsArrayOf([IsConstraints({ a: [IsNumber()] })])], [{ a: 1 }, { a: "f" }]).isValid).toBe(false);

    /* ValidationError */

    // IsConstraints(validators).validate(any)
    const valueA = "abc";
    const vErrA = validate([IsConstraints({ a: [IsNumber()] })], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid property "a" value, expected undefined to be a number.`,
      value: undefined,
      propertyPath: "a",
      target: "abc",
      validator: { name: "IsNumber" },
    });

    // IsConstraints(validator, messageFn).validate(any)
    const valueB = "bob";
    const messageFnC = ({ validator, value }) =>
      `Error at ${validator.name}: ${JSON.stringify(value)} should be a number.`;
    const vErrB = validate([IsConstraints({ a: [IsNumber()] }, messageFnC)], valueB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Error at IsConstraints: "bob" should be a number.`,
      value: "bob",
      propertyPath: undefined,
      target: "bob",
      validator: {
        name: "IsConstraints",
      },
    });

    // IsConstraints(validators).validate(any, string, any)
    const targetC = { a: { b: true } };
    const vErrC = validate({ a: [IsConstraints({ b: [IsString()] })] }, targetC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Invalid property "a.b" value, expected true to be a string.`,
      value: true,
      propertyPath: "a.b",
      target: { a: { b: true } },
      validator: { name: "IsString" },
    });

    // IsConstraints(constraints, messageFn).validate(any, propertyPath, target)
    const targetD = { a: { b: "Foo" } };
    const messageFnD = ({ validator, value, propertyPath, target }) =>
      `Error at ${validator.name}: "${propertyPath}" ${JSON.stringify(value)} should be a number.`;
    const vErrD = validate({ a: [IsConstraints({ b: [IsNumber()] }, messageFnD)] }, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `Error at IsConstraints: "a" {"b":"Foo"} should be a number.`,
      value: { b: "Foo" },
      propertyPath: "a",
      target: { a: { b: "Foo" } },
      validator: { name: "IsConstraints" },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. constraints */
    const constraintsErr = new TypeError(`Argument constraints should be Constraints.`);

    // @ts-ignore
    expect(() => IsConstraints()()).toThrow(constraintsErr);
    // @ts-ignore
    expect(() => IsConstraints([])()).toThrow(constraintsErr);
    // @ts-ignore
    expect(() => IsConstraints({})()).toThrow(constraintsErr);
    // @ts-ignore
    expect(() => IsConstraints("abc")()).toThrow(constraintsErr);
  });
});
