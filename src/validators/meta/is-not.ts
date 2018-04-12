import { Validator, ValidatorFunctor, isValidators, ValidationResult, ValidationError } from "../../validator";
import { validateValidators } from "../../validate";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";
import { ValidatorFunctorFn } from "../../validator/validator-functor";

export function IsNot(validators: Validator[], messageFn?: ValidationErrorMessageFn, name?: string): Validator {
  const defaultName = "IsNot";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be valid.`);

  /* 1. Validate arguments */

  if (!isValidators(validators)) {
    throw new TypeError(`Argument validators should be a non empty Validator[].`);
  }

  // messageFn is validated by Validator

  // name is validated by Validator

  /* 2. Arguments default */

  name = name || defaultName;
  messageFn = messageFn || defaultMessageFn;

  /* 3. Validator */

  const validateFn: ValidatorFunctorFn = ({ self, value, propertyPath, target }) => {
    const validationResult = validateValidators(validators, value, propertyPath!, target);

    if (validationResult.isInvalid) {
      return ValidationResult.Valid();
    }

    const message = messageFn!({
      validator: self,
      value,
      propertyPath,
      target,
    });
    const error = new ValidationError(self, message, value, propertyPath, target);

    return ValidationResult.Invalid(error);
  };

  return new ValidatorFunctor(name, validateFn, messageFn);
}
