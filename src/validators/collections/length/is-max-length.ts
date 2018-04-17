import { isLength } from "lodash";

import { ValidatorPredicate } from "../../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../../message";

export type IsMaxLengthType = ValidatorPredicate<IsMaxLengthOptions>;

export interface IsMaxLengthOptions {
  maxLength: number;
}

export function IsMaxLength(maxLength: number, messageFn?: ValidationErrorMessageFn): IsMaxLengthType {
  /* 0. Constants */

  const name = "IsMaxLength";
  const defaultMessageFn = stdErrorMsgFn(({ validator, value }) =>
    `${JSON.stringify(value)} length to be greater than or equal to ${(validator as IsMaxLengthType).options.maxLength}.`);

  /* 1. Validate Arguments */

  // maxLength
  if (!isLength(maxLength)) {
    throw new TypeError(`Argument maxLength should be a positive integer.`);
  }

  // messageFn
  // ValidatorPredicate validates

  /* 2. Validator */

  const valMessageFn = messageFn || defaultMessageFn;

  const predicate = (value: any, options?: IsMaxLengthOptions) => {
    try {
      return value.length <= options!.maxLength;
    } catch (err) {
      return false;
    }
  };

  const options: IsMaxLengthOptions = { maxLength };

  return new ValidatorPredicate<IsMaxLengthOptions>(name, predicate, valMessageFn, options);
}
