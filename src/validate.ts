import { entries, get } from "lodash";

import { Validator, ValidationResult, ValidationResultType, isValidators } from "./validator";

import { Constraints, isConstraints } from "./index";

export function validateValidators(
  validators: Validator[],
  value: any,
  propertyPath?: string,
  target?: any,
): ValidationResult {
  /* 1. Check arguments */

  if (!isValidators(validators)) {
    throw new TypeError(`Invalid argument validators, should be Validator[].`);
  }

  /* 2. Execute validation */

  for (const validator of validators) {
    const validationResult = validator.validate(value, propertyPath, target);

    switch (validationResult._type) {
      case ValidationResultType.Valid:
        break;

      case ValidationResultType.Invalid:
      case ValidationResultType.ValidSkip:
        return validationResult;

      default:
        throw new Error(`Unreacheable!`);
    }
  }

  return ValidationResult.Valid();
}

export function validateConstraints(
  constraints: Constraints,
  value: any,
  target: any,
  propertyPath: string = "",
): ValidationResult {
  for (const [contraintsKey, contraintsValue] of entries(constraints)) {
    let validationResult;
    const path = propertyPath === "" ? contraintsKey : `${propertyPath}.${contraintsKey}`;
    const targetValue = get(value, contraintsKey);

    if (isValidators(contraintsValue)) {
      validationResult = validateValidators(contraintsValue as Validator[], targetValue, path, target);
    } else if (isConstraints(contraintsValue)) {
      validationResult = validateConstraints(contraintsValue as Constraints, targetValue, target, path);
    } else {
      throw new TypeError(`target's property "${path}" should be an Constraints or Validator[]`);
    }

    if (!validationResult.isValid) {
      return validationResult;
    }
  }

  return ValidationResult.Valid();
}

/**
 * Validates a value given a list of validators.
 *
 * @variation 0
 *
 * @param {Validator[]} validators
 * @param {any} value
 *
 * @returns {ValidationResult} Object containing the results of the validation.
 *
 * @example
 * validate([IsNumber()], 123).isValid //=> true
 *
 * @example
 * validate([IsInteger()], 3.14).isValid //=> false
 *
 * @example
 * validate([IsArray(), IsArrayOf([IsString()])], ["ab", "cd"]).isValid //=> true
 */
/**
 * Validates a value given some contraints.
 *
 * @variation 1
 *
 * @param {Constraints} constraints
 * @param {any} target
 *
 * @returns {ValidationResult} Object containing the results of the validation.
 *
 * @example
 * const constraints = {
 *   name: [IsString(), IsNotEmpty()],
 * }
 * validate(constraints, { name: "Bob" }).isValid //=> true
 *
 * @example
 * validate([IsInteger()], 3.14).isValid //=> false
 *
 * @example
 * validate([IsArray(), IsArrayOf([IsString()])], ["ab", "cd"]).isValid //=> true
 */
export function validate(validators: Validator[], value: any): ValidationResult;
export function validate(constraints: Constraints, target: any): ValidationResult;
export function validate(arg0: Validator[] | Constraints, arg1: any): ValidationResult {
  if (isValidators(arg0)) {
    return validateValidators(arg0 as Validator[], arg1, undefined, arg1);
  } else if (isConstraints(arg0)) {
    return validateConstraints(arg0 as Constraints, arg1, arg1);
  } else {
    throw new TypeError(`Argument provided is not an Validator[] or Constraints`);
  }
}
