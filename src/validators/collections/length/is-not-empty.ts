import { isEmpty, negate } from "lodash";

import { Validator, ValidatorPredicate } from "../../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../../message";

export function IsNotEmpty(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsNotEmpty";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to not be empty.`);

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, negate(isEmpty), messageFn);
}
