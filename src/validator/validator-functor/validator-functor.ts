import { isFunction } from "lodash";

import { Validator } from "../validator";
import { ValidationResult } from "../validation-result";
import { ValidationErrorMessageFn, isValidationErrorMessageFn } from "../../message";

export interface ValidatorFunctorFnParams<T> {
  self: ValidatorFunctor<T>;
  value: any;
  propertyPath?: string;
  target?: any;
}

export type ValidatorFunctorFn<T = undefined> = (options: ValidatorFunctorFnParams<T>) => ValidationResult;

export class ValidatorFunctor<T = undefined> extends Validator {
  public readonly validateFn: ValidatorFunctorFn<T>;
  public readonly messageFn?: ValidationErrorMessageFn;
  public readonly options: T;

  public constructor(
    name: string,
    validateFn: ValidatorFunctorFn<T>,
    messageFn?: ValidationErrorMessageFn,
    options?: T,
  ) {
    /* 1. Validate arguments */

    // name is validated by super()

    if (messageFn != null && !isValidationErrorMessageFn(messageFn)) {
      throw new TypeError(`Argument messageFn should be a ValidationErrorMessageFn.`);
    }

    if (!isFunction(validateFn)) {
      throw new TypeError(`Argument validateFn should be a validator function.`);
    }

    // extra is validated by super()

    /* 2. Construct */

    super(name);
    this.validateFn = validateFn;
    this.messageFn = messageFn;
    this.options = options!;
  }

  public validate(value: any, propertyPath?: string, target?: any): ValidationResult {
    return this.validateFn({ self: this, value, propertyPath, target });
  }
}
