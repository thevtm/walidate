import { ValidationResult, ValidatorFunctor, Constraints, isConstraints, ValidationError } from "../../validator";
import { validateConstraints } from "../../validate";
import { ValidatorFunctorFn } from "../../validator/validator-functor";
import { ValidationErrorMessageFn } from "../..";

export type IsConstraintsType = ValidatorFunctor<IsConstraintsOptions>;

export interface IsConstraintsOptions {
  constraints: Constraints;
}

export function IsConstraints(constraints: Constraints, messageFn?: ValidationErrorMessageFn): IsConstraintsType {
  const name = "IsConstraints";

  /* 1. Check arguments */

  if (!isConstraints(constraints)) {
    throw new TypeError(`Argument constraints should be Constraints.`);
  }

  // messageFn is checked by ValidatorFunctor

  /* 2. Create options */

  const options: IsConstraintsOptions = {
    constraints,
  };

  /* 3. Create Validator */

  const validateFn: ValidatorFunctorFn<IsConstraintsOptions> = ({ self, value, propertyPath, target }) => {
    const { constraints } = self.options;

    const validationRes = validateConstraints(constraints, value, target, propertyPath);

    if (validationRes.isInvalid) {
      if (messageFn == null) {
        return validationRes;
      } else {
        // create error
        const message = messageFn!({
          validator: self,
          value,
          propertyPath,
          target,
        });
        const error = new ValidationError(self, message, value, propertyPath, target);

        return ValidationResult.Invalid(error);
      }
    }

    return ValidationResult.Valid();
  };

  return new ValidatorFunctor<IsConstraintsOptions>(name, validateFn, messageFn, options);
}
