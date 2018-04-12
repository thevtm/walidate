import { isObject } from "lodash";

import { Validator, ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export function IsObject(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsObject";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be an object.`);

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, isObject, messageFn);
}
