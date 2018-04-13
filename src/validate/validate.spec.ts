import {
  Constraints,
  ValidationResult,
  IsNumber,
  IsOptional,
  Validator,
  IsArrayOf,
  IsArray,
  IsString,
  IsMatch,
  IsNotEmpty,
} from "../index";

import { validate } from "../validate";
import { ValidatorFunctor } from "../validator";

describe("validate", () => {
  it("expect to throw when it receives invalid arguments", () => {
    const argValidatorsError = new TypeError(`Argument provided is not an Validator[] or Constraints`);

    // @ts-ignore
    expect(() => validate()).toThrow(argValidatorsError);
    // @ts-ignore
    expect(() => validate(1, 0)).toThrow(argValidatorsError);
    // @ts-ignore
    expect(() => validate("foo")).toThrow(argValidatorsError);
    // @ts-ignore
    expect(() => validate("foo", 0)).toThrow(argValidatorsError);
    // @ts-ignore
    expect(() => validate([])).toThrow(argValidatorsError);
    // @ts-ignore
    expect(() => validate([IsNumber(), 12])).toThrow(argValidatorsError);
  });

  describe("validate(Validator[], any): ValidationResult", () => {
    it("should return an ValidationResult according to spec", () => {
      expect(validate([IsNumber()], 3).isValid).toBe(true);
      expect(validate([IsNumber()], "abc").isValid).toBe(false);

      expect(validate([IsNumber()], 3).isInvalid).toBe(false);
      expect(validate([IsNumber()], "abc").isInvalid).toBe(true);

      expect(validate([IsOptional(), IsNumber()], 3).isValid).toBe(true);
      expect(validate([IsOptional(), IsNumber()], undefined).isValid).toBe(true);
      expect(validate([IsOptional(), IsNumber()], "foo").isValid).toBe(false);
    });

    it("expect to throw when it receives invalid arguments", () => {
      /* 1. validators */
      const argContraintsError = `Invalid argument validators, should be Validator[].`;

      const badValidator = () =>
        // @ts-ignore
        new ValidatorFunctor("badValidator", () => ({ _type: "abc" }));

      expect(() => validate([badValidator()], 1)).toThrow(`Unreacheable!`);
    });
  });

  describe("validate(Constraints, any): ValidationResult", () => {
    it("should return an ValidationResult according to spec", () => {
      const constraintA: Constraints = { a: [IsNumber()] };

      expect(validate(constraintA, {}).isValid).toBe(false);
      expect(validate(constraintA, { a: 3 }).isValid).toBe(true);
      expect(validate(constraintA, { a: "a" }).isValid).toBe(false);

      const constraintB: Constraints = {
        a: [IsNumber()],
        b: [IsOptional(), IsNumber()],
      };

      expect(validate(constraintB, { a: 0, b: 31 }).isValid).toBe(true);
      expect(validate(constraintB, { a: 0 }).isValid).toBe(true);
      expect(validate(constraintB, { a: "a" }).isValid).toBe(false);
      expect(validate(constraintB, { a: 0, b: "b" }).isValid).toBe(false);

      const constraintC: Constraints = {
        a: [IsNumber()],
        b: { c: [IsArrayOf([IsNumber()])] },
      };

      expect(validate(constraintC, { a: 1, b: { c: [1, 2] } }).isValid).toBe(true);
      expect(validate(constraintC, { a: 1, b: { c: [1, "a"] } }).isValid).toBe(false);
      expect(validate(constraintC, { b: { c: [1, "a"] } }).isValid).toBe(false);

      const constraintD: Constraints = {
        a: {
          b: [IsArray()],
          c: {
            d: [IsOptional(), IsNumber()],
          },
        },
      };

      expect(validate(constraintD, { a: { b: [], c: { d: 1 } } }).isValid).toBe(true);
      expect(validate(constraintD, { a: { b: 0, c: { d: 1 } } }).isValid).toBe(false);
      expect(validate(constraintD, { a: { b: [], c: { d: "abc" } } }).isValid).toBe(false);
    });

    it("expect to throw when it receives invalid arguments", () => {
      /* 1. constraints */
      const argContraintsError = (p) => `target's property "${p}" should be an Constraints or Validator[]`;

      // @ts-ignore
      expect(() => validate({ a: 1 }, { a: 1 })).toThrow(argContraintsError("a"));

      expect(() =>
        // @ts-ignore
        validate({ a: [IsNumber()], b: [IsArray(), 32] }, { a: 1 }),
      ).toThrow(argContraintsError("b"));
      // @ts-ignore
      expect(() => validate({ a: { b: [IsArray(), 32] } }, { a: 1 })).toThrow(argContraintsError("a.b"));
      // @ts-ignore
      expect(() =>
        validate(
          // @ts-ignore
          { a: { b: [IsArray()], c: { d: 1 } } },
          { a: { b: [], c: { d: 1 } } },
        ),
      ).toThrow(argContraintsError("a.c.d"));

      /* 2. target */
      // Any is acceptable
    });
  });
});
