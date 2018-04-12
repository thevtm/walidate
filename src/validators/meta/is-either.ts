import { isArray, isEmpty, some } from "lodash";

import { Validator, ValidationResult, ValidationError, isValidators, ValidatorFunctor } from "../../validator";
import { validateValidators } from "../../validate";
import { ValidationErrorMessageFn, stdErrorMsgFn, isValidationErrorMessageFn } from "../../message";
import { ValidatorFunctorFn } from "../../validator/validator-functor";

export function IsEither(
  arrayOfValidators: Validator[][],
  messageFn?: ValidationErrorMessageFn,
  name?: string,
): Validator {
  const defaultName = "IsEither";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be valid.`);

  /* 1. Validate arguments */

  if (!isArray(arrayOfValidators) || isEmpty(arrayOfValidators) || some(arrayOfValidators, (vs) => !isValidators(vs))) {
    throw new TypeError(`Argument arrayOfValidators should be a non empty Validator[][].`);
  }

  if (messageFn != null && !isValidationErrorMessageFn(messageFn)) {
    throw new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);
  }

  // name is validated by ValidatorFunctor

  /* 2. Arguments default */

  name = name || defaultName;
  messageFn = messageFn || defaultMessageFn;

  /* 3. Validator */

  const validateFn: ValidatorFunctorFn = ({ self, value, propertyPath, target }) => {
    for (const vs of arrayOfValidators) {
      const validationResult = validateValidators(vs, value, propertyPath, target);

      if (validationResult.isValid) {
        return ValidationResult.Valid();
      }
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
