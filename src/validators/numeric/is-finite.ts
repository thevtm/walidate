import { isFinite } from "lodash";

import { Validator, ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export function IsFinite(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsFinite";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be a finite number.`);

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, isFinite, messageFn);
}
