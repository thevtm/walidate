import { isString } from "lodash";

import { Validator, ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export function IsString(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsString";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be a string.`);

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, isString, messageFn);
}
