import { isArray } from "lodash";

import { Validator, ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export function IsArray(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsArray";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be an array.`);

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, isArray, messageFn);
}
