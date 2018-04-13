import { Validator, ValidationResult, isValidators } from "../validator";
import { Constraints, isConstraints } from "../index";

import { validateValidators } from "./validate-validators";
import { validateConstraints } from "./validate-constraints";

/**
 * Validates a value given a list of validators.
 *
 * @variation 0
 * @param {Validator[]} validators
 * @param {any} value
 * @returns {ValidationResult} Object containing the results of the validation.
 *
 * @example
 * validate([IsNumber()], 123).isValid //=> true
 * @example
 * validate([IsInteger()], 3.14).isValid //=> false
 * @example
 * validate([IsArray(), IsArrayOf([IsString()])], ["ab", "cd"]).isValid //=> true
 */
/**
 * Validates a value given some contraints.
 *
 * @variation 1
 * @param {Constraints} constraints
 * @param {any} target
 * @returns {ValidationResult} Object containing the results of the validation.
 *
 * @example
 * const constraints = {
 *   name: [IsString(), IsNotEmpty()],
 * }
 * validate(constraints, { name: "Bob" }).isValid //=> true
 * @example
 * validate([IsInteger()], 3.14).isValid //=> false
 * @example
 * validate([IsArray(), IsArrayOf([IsString()])], ["ab", "cd"]).isValid //=> true
 */
export function validate(validators: Validator[], value: any): ValidationResult;
export function validate(constraints: Constraints, target: any): ValidationResult;
export function validate(arg0: Validator[] | Constraints, arg1: any): ValidationResult {
  if (isValidators(arg0)) {
    return validateValidators(arg0 as Validator[], arg1, arg1);
  } else if (isConstraints(arg0)) {
    return validateConstraints(arg0 as Constraints, arg1, arg1);
  } else {
    throw new TypeError(`Argument provided is not an Validator[] or Constraints`);
  }
}
