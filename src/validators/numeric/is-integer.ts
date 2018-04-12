import { isInteger } from "lodash";

import { Validator, ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export function IsInteger(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsInteger";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be an integer.`);

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, isInteger, messageFn);
}
