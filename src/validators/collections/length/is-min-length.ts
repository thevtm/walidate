import { isLength } from "lodash";

import { ValidatorPredicate } from "../../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../../message";

export type IsMinLengthType = ValidatorPredicate<IsMinLengthOptions>;

export interface IsMinLengthOptions {
  minLength: number;
}

export function IsMinLength(minLength: number, messageFn?: ValidationErrorMessageFn): IsMinLengthType {
  /* 0. Constants */

  const name = "IsMinLength";
  const defaultMessageFn = stdErrorMsgFn(({ validator, value }) =>
    `${JSON.stringify(value)} length to be greater than or equal to ${(validator as IsMinLengthType).options.minLength}.`);

  /* 1. Validate Arguments */

  // minLength
  if (!isLength(minLength)) {
    throw new TypeError(`Argument minLength should be a positive integer.`);
  }

  // messageFn
  // ValidatorPredicate validates

  /* 2. Validator */

  const valMessageFn = messageFn || defaultMessageFn;

  const predicate = (value: any, options?: IsMinLengthOptions) => {
    try {
      return value.length >= options!.minLength;
    } catch (err) {
      return false;
    }
  };

  const options: IsMinLengthOptions = { minLength };

  return new ValidatorPredicate<IsMinLengthOptions>(name, predicate, valMessageFn, options);
}
