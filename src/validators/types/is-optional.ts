import { Validator, ValidationResult, ValidatorFunctor } from "../../index";
import { ValidatorFunctorFn } from "../../validator/validator-functor";

export function IsOptional(): Validator {
  const name = "IsOptional";

  const validateFn: ValidatorFunctorFn = ({ value, propertyPath, target }) => {
    if (value == null) {
      return ValidationResult.ValidSkip();
    }

    return ValidationResult.Valid();
  };

  return new ValidatorFunctor(name, validateFn);
}
