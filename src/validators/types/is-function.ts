import { isFunction } from "lodash";

import { Validator, ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export function IsFunction(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsFunction";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be a function.`);

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, isFunction, messageFn);
}
