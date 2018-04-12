import { isBoolean } from "lodash";

import { Validator, ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export function IsBoolean(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsBoolean";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be a boolean.`);

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, isBoolean, messageFn);
}
