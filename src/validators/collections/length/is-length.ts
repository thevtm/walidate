import { isLength } from "lodash";

import { ValidatorPredicate } from "../../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../../message";

export type IsLengthType = ValidatorPredicate<IsLengthOptions>;

export interface IsLengthOptions {
  length: number;
}

export function IsLength(length: number, messageFn?: ValidationErrorMessageFn): IsLengthType {
  /* 0. Constants */

  const name = "IsLength";
  const defaultMessageFn = stdErrorMsgFn(
    ({ validator, value }) =>
      `${JSON.stringify(value)} length to be equal to ${(validator as IsLengthType).options.length}.`,
  );

  /* 1. Validate Arguments */

  // length
  if (!isLength(length)) {
    throw new TypeError(`Argument length should be a positive integer.`);
  }

  // messageFn
  // ValidatorPredicate validates

  /* 2. Validator */

  const valMessageFn = messageFn || defaultMessageFn;

  const predicate = (value: any, options?: IsLengthOptions) => {
    try {
      return value.length === options!.length;
    } catch (err) {
      return false;
    }
  };

  const options: IsLengthOptions = { length };

  return new ValidatorPredicate<IsLengthOptions>(name, predicate, valMessageFn, options);
}
