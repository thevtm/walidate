import {
  Validator,
  IsNumber,
  IsOptional,
  IsArray,
  IsArrayOf,
  validate,
  IsString,
  IsNotEmpty,
  IsConstraints,
} from "../../../index";
import { isContext } from "vm";

describe("IsArrayOf", () => {
  it("should return an Validator according to spec", () => {
    /* 1. Validation */

    // Validator[]

    expect(validate([IsArrayOf([IsNumber()])], []).isValid).toBe(true);
    expect(validate([IsArrayOf([IsNumber()])], [1, 2, 3, NaN]).isValid).toBe(true);
    expect(validate([IsArrayOf([IsNumber()])], [0, 2, "b"]).isValid).toBe(false);
    expect(validate([IsArrayOf([IsNumber()])], ["abc"]).isValid).toBe(false);

    expect(validate([IsArrayOf([IsOptional(), IsArrayOf([IsNumber()])])], [[1]]).isValid).toBe(true);
    expect(validate([IsArrayOf([IsOptional(), IsArrayOf([IsNumber()])])], [[1, 2], [0, "a"]]).isValid).toBe(false);

    // Constraints

    const constraints0 = { a: [IsArray(), IsArrayOf([IsNumber()])] };

    expect(validate(constraints0, { a: 1 }).isValid).toBe(false);
    expect(validate(constraints0, { a: "foo" }).isValid).toBe(false);
    expect(validate(constraints0, { a: [] }).isValid).toBe(true);
    expect(validate(constraints0, { a: [1, 2] }).isValid).toBe(true);
    expect(validate(constraints0, { a: [1, 2, null] }).isValid).toBe(false);

    const constraints1 = {
      a: [
        IsArray(),
        IsArrayOf([
          IsConstraints({
            name: [IsString(), IsNotEmpty()],
          }),
        ]),
      ],
    };

    expect(validate(constraints1, { a: 1 }).isValid).toBe(false);
    expect(validate(constraints1, { a: "foo" }).isValid).toBe(false);
    expect(validate(constraints1, { a: [] }).isValid).toBe(true);
    expect(validate(constraints1, { a: [{ name: "Bob" }] }).isValid).toBe(true);
    expect(validate(constraints1, { a: [{ name: "foo" }, { name: "" }] }).isValid).toBe(false);

    /* 2. ValidationError */

    // 2.1 IsArrayOf(validators).validate(any)
    const valueA = ["abc"];
    const vErrA = validate([IsArrayOf([IsNumber()])], valueA).error;

    expect(vErrA.validator).toBeInstanceOf(Validator);
    expect(vErrA).toMatchObject({
      message: `Invalid value, expected "abc" to be a number.`,
      value: "abc",
      propertyPath: undefined,
      target: ["abc"],
      validator: { name: "IsNumber" },
    });

    // 2.2 IsArrayOf(validators).validate(any, string, any)
    const targetB = { age: [1, 2, true] };
    const vErrB = validate({ age: [IsArrayOf([IsNumber()])] }, targetB).error;

    expect(vErrB.validator).toBeInstanceOf(Validator);
    expect(vErrB).toMatchObject({
      message: `Invalid property "age[2]" value, expected true to be a number.`,
      value: targetB.age[2],
      propertyPath: "age[2]",
      target: targetB,
      validator: { name: "IsNumber" },
    });

    // 2.3 IsArrayOf(constraints).validate(any)
    const targetC = { a: [1, 2, null] };
    const constraintsC = { a: [IsArray(), IsArrayOf([IsNumber()])] };
    const vErrC = validate(constraintsC, targetC).error;

    expect(vErrC.validator).toBeInstanceOf(Validator);
    expect(vErrC).toMatchObject({
      message: `Invalid property "a[2]" value, expected null to be a number.`,
      value: targetC.a[2],
      propertyPath: "a[2]",
      target: targetC,
      validator: {
        name: "IsNumber",
        options: undefined,
      },
    });

    // 2.4 IsArrayOf(messageFn).validate(any)
    const targetD = { a: [{ b: 1 }, { b: null }] };
    const constraintsD = { a: [IsArray(), IsArrayOf([IsConstraints({ b: [IsNumber()] })])] };
    const vErrD = validate(constraintsD, targetD).error;

    expect(vErrD.validator).toBeInstanceOf(Validator);
    expect(vErrD).toMatchObject({
      message: `Invalid property "a[1].b" value, expected null to be a number.`,
      value: targetD.a[1].b,
      propertyPath: "a[1].b",
      target: targetD,
      validator: { name: "IsNumber" },
    });

    // 2.5 IsArrayOf(messageFn).validate(any)
    const valueE = ["abc"];
    const messageFnE = ({ validator, value }) => `Error at ${validator.name} with value ${JSON.stringify(value)}.`;
    const vErrE = validate([IsArrayOf([IsNumber()], messageFnE)], valueE).error;

    expect(vErrE.validator).toBeInstanceOf(Validator);
    expect(vErrE).toMatchObject({
      message: `Error at IsArrayOf with value "abc".`,
      value: valueE[0],
      propertyPath: undefined,
      target: ["abc"],
      validator: {
        name: "IsArrayOf",
      },
    });

    // 2.6 IsArrayOf(messageFn).validate(any, string, any)
    const targetF = { a: ["abc"] };
    const messageFnF = ({ validator, value, propertyPath }) =>
      `${validator.name} Error at "${propertyPath}" with value ${JSON.stringify(value)}.`;
    const vErrF = validate({ a: [IsArrayOf([IsNumber(), IsArray()], messageFnF)] }, targetF).error;

    expect(vErrF.validator).toBeInstanceOf(Validator);
    expect(vErrF).toMatchObject({
      message: `IsArrayOf Error at "a[0]" with value "abc".`,
      value: targetF.a[0],
      propertyPath: "a[0]",
      target: targetF,
      validator: {
        name: "IsArrayOf",
      },
    });
  });

  it("should throw when it receives invalid arguments", () => {
    /* 1. validators */
    const validatorsErr = new TypeError(
      `Argument validators should be an non empty array of Validators or Constraints.`,
    );

    // @ts-ignore
    expect(() => IsArrayOf()()).toThrow(validatorsErr);
    // @ts-ignore
    expect(() => IsArrayOf([])()).toThrow(validatorsErr);
    // @ts-ignore
    expect(() => IsArrayOf("abc")()).toThrow(validatorsErr);

    /* 2. messageFn */
    const messageErr = new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);

    // @ts-ignore
    expect(() => IsArrayOf([IsArray()], 123)).toThrow(messageErr);
  });
});
