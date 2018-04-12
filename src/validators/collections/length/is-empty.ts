import { isEmpty } from "lodash";

import { Validator, ValidatorPredicate } from "../../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../../message";

export function IsEmpty(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsEmpty";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be empty.`);

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, isEmpty, messageFn);
}
