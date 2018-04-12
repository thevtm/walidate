import { isDate } from "lodash";

import { Validator, ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export function IsDate(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsDate";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be a date.`);

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, isDate, messageFn);
}
