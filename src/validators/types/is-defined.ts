import { Validator, ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export function IsDefined(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsDefined";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be defined.`);
  const predicate = (v: any) => v != null;

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, predicate, messageFn);
}
