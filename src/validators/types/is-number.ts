import { isNumber } from "lodash";

import { Validator, ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export function IsNumber(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsNumber";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be a number.`);

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, isNumber, messageFn);
}
