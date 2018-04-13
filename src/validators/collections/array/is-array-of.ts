import { entries } from "lodash";

import { Validator, ValidationResult, isValidators, ValidationError, ValidatorFunctor } from "../../../validator";

import { validateValidators } from "../../../validate";
import { ValidationErrorMessageFn } from "../../../message";
import { ValidatorFunctorFn } from "../../../validator/validator-functor";

export type IsArrayOfType = ValidatorFunctor<IsArrayOfOptions>;

export interface IsArrayOfOptions {
  validators: Validator[];
}

export function IsArrayOf(validators: Validator[], messageFn?: ValidationErrorMessageFn): IsArrayOfType {
  /* 0. Constants */

  const name = "IsArrayOf";

  /* 1. Check arguments */

  if (!isValidators(validators)) {
    throw new TypeError(`Argument validators should be an non empty array of Validators or Constraints.`);
  }

  // messageFn is checked by ValidatorFunctor

  /* 2. Create options */

  const options: IsArrayOfOptions = {
    validators,
  };

  /* 3. Create Validator */

  const validateFn: ValidatorFunctorFn<IsArrayOfOptions> = ({ self, value, propertyPath, target }) => {
    const { validators } = self.options;

    for (const [i, v] of entries(value as any[])) {
      const elementPath = propertyPath && `${propertyPath}[${i}]`;

      const valResult = validateValidators(validators as Validator[], v, target, elementPath!);

      if (valResult.isInvalid) {
        if (messageFn == null) {
          return valResult;
        } else {
          const message = messageFn!({
            validator: self,
            value: v,
            propertyPath: elementPath,
            target,
          });
          const error = new ValidationError(self, message, v, elementPath, target);

          return ValidationResult.Invalid(error);
        }
      }
    }

    return ValidationResult.Valid();
  };

  return new ValidatorFunctor<IsArrayOfOptions>(name, validateFn, messageFn, options);
}
