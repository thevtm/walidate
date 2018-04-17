import { Validator, ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export function IsNegative(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsNegative";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be negative.`);

  const predicate = (value: any) => value < 0;

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, predicate, messageFn);
}
