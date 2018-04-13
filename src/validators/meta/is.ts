import {
  ValidationResult,
  ValidatorFunctor,
  Constraints,
  isConstraints,
  ValidationError,
  Validator,
  isValidators,
} from "../../validator";
import { validateConstraints, validateValidators } from "../../validate";
import { ValidatorFunctorFn } from "../../validator/validator-functor";
import { ValidationErrorMessageFn } from "../..";

export enum IsInputType {
  Validators,
  Constraints,
}

export type IsType = ValidatorFunctor<IsOptions>;

export interface IsOptions {
  input: Validator[] | Constraints;
  inputType: IsInputType;
}

export function Is(validators: Validator[], messageFn?: ValidationErrorMessageFn): IsType;
export function Is(constraints: Constraints, messageFn?: ValidationErrorMessageFn): IsType;
export function Is(input: Validator[] | Constraints, messageFn?: ValidationErrorMessageFn): IsType {
  /* 0. Constants */

  const name = "Is";

  /* 1. Check arguments */

  if ((isValidators(input) || isConstraints(input)) === false) {
    throw new TypeError(`Argument input should be an Validator[] or Constraints.`);
  }

  // messageFn is checked by ValidatorFunctor

  /* 2. Create options */

  const options: IsOptions = {
    input,
    inputType: isValidators(input) ? IsInputType.Validators : IsInputType.Constraints,
  };

  /* 3. Create Validator */

  const validateFn: ValidatorFunctorFn<IsOptions> = ({ self, value, propertyPath, target }) => {
    /* 0. Constants */

    const { input, inputType } = self.options;

    /* 1. Validate */

    let validationRes: ValidationResult;

    switch (inputType) {
      case IsInputType.Validators:
        validationRes = validateValidators(input as Validator[], value, target, propertyPath);
        break;

      case IsInputType.Constraints:
        validationRes = validateConstraints(input as Constraints, value, target, propertyPath);
        break;

      default:
        throw new Error("Unreacheable");
    }

    /* 2. Invalid */

    if (validationRes.isInvalid) {
      if (messageFn == null) {
        return validationRes;
      } else {
        // Custom message
        const message = messageFn!({ validator: self, value, propertyPath, target });
        const error = new ValidationError(self, message, value, propertyPath, target);

        return ValidationResult.Invalid(error);
      }
    }

    /* 3. Valid */

    return ValidationResult.Valid();
  };

  return new ValidatorFunctor<IsOptions>(name, validateFn, messageFn, options);
}
