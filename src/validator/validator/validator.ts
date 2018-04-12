import { isString, isArray, isEmpty, every } from "lodash";

import { ValidationResult } from "../validation-result";

export function isValidator(value: any): boolean {
  return value instanceof Validator;
}

export function isValidators(values: any): boolean {
  return isArray(values) && !isEmpty(values) && every(values, isValidator);
}

export abstract class Validator {
  public readonly name: string;

  public constructor(name: string) {
    const isName = (n: any): boolean => isString(n) && !isEmpty(n);

    /* 1. Validate arguments */

    if (!isName(name)) {
      throw new TypeError(`Argument name should be a non empty string.`);
    }

    /* 2. Properties */

    this.name = name;
  }

  public abstract validate(value: any, propertyPath?: string, target?: any): ValidationResult;
}
