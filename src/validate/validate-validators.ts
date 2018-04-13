import { Validator, ValidationResult, ValidationResultType, isValidators } from "../validator";

export function validateValidators(
  validators: Validator[],
  value: any,
  target?: any,
  propertyPath?: string,
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
