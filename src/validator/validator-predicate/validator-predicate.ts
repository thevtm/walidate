import { isFunction } from "lodash";

import { Validator } from "../validator";
import { ValidationErrorMessageFn, isValidationErrorMessageFn } from "../../message";
import { ValidationError } from "../validation-error";
import { ValidationResult } from "../validation-result";

export type ValidatorPredicateFn<T = undefined> = (value: any, options?: T) => boolean;

export class ValidatorPredicate<T = undefined> extends Validator {
  public readonly predicate: ValidatorPredicateFn<T>;
  public readonly messageFn: ValidationErrorMessageFn;
  public readonly options: T;

  public constructor(
    name: string,
    predicate: ValidatorPredicateFn<T>,
    messageFn: ValidationErrorMessageFn,
    options?: T,
  ) {
    /* 1. Validate arguments */

    // name is validated by super()

    if (!isFunction(predicate)) {
      throw new TypeError(`Argument predicate should be a function.`);
    }

    if (messageFn != null && !isValidationErrorMessageFn(messageFn)) {
      throw new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);
    }

    /* 2. Construct */

    super(name);
    this.predicate = predicate;
    this.messageFn = messageFn;
    this.options = options!;
  }

  public validate(value: any, propertyPath?: string, target?: any): ValidationResult {
    if (this.predicate(value, this.options)) {
      return ValidationResult.Valid();
    }

    const message = this.messageFn({
      validator: this,
      value,
      propertyPath,
      target,
    });
    const error = new ValidationError(this, message, value, propertyPath, target);

    return ValidationResult.Invalid(error);
  }
}
