import { Validator, IsNumber, IsOptional, IsArray, IsConstraints, validate, IsString } from "../../index";

describe("IsConstraints", () => {
  it("should return a Validator according to spec", () => {
    /* Validation logic */

    expect(validate([IsConstraints({ a: [IsNumber()] })], { a: 3 }).isValid).toBe(true);
    expect(validate([IsConstraints({ a: [IsNumber()] })], "foo").isValid).toBe(false);

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

    // IsConstraints(validators).validate(any, string, any)
    const targetB = { age: true };
    const vErrB = validate([IsConstraints({ a: [IsString()] })], targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age" value, expected true to be a number.`,
      value: true,
      propertyPath: "age",
      target: { age: true },
      validator: { name: "IsNumber" },
    });

    // IsConstraints(constraints).validate(any)
    const targetC = { a: "Foo" };
    const constraintsC = { a: [IsNumber()] };
    const vErrC = validate([IsConstraints(constraintsC)], targetC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Invalid property "a" value, expected "Foo" to be a number.`,
      value: "Foo",
      propertyPath: "a",
      target: { a: "Foo" },
      validator: { name: "IsNumber" },
    });

    // IsConstraints(validator, messageFn).validate(any)
    const valueD = "bob";
    const messageFnD = ({ validator, value }) =>
      `Error at ${validator.name}: ${JSON.stringify(value)} should be a number.`;
    const vErrD = validate([IsConstraints({ a: [IsNumber()] }, messageFnD)], valueD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `Error at Is: "bob" should be a number.`,
      value: "bob",
      propertyPath: undefined,
      target: "abc",
      validator: {
        name: "Is",
        options: {
          isValidators: true,
          isConstraints: false,
        },
      },
    });

    // IsConstraints(constraints, messageFn).validate(any, propertyPath, target)
    const targetE = { a: "Foo" };
    const constraintsE = { a: [IsNumber()] };
    const messageFnE = ({ validator, value, propertyPath, target }) =>
      `Error at ${validator.name}: "${propertyPath}" ${JSON.stringify(value)} should be a number.`;
    // const vErrE = validate(Is);

    // expect();
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
