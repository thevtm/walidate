import { Validator, ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export function IsPositive(messageFn?: ValidationErrorMessageFn): Validator {
  const name = "IsPositive";
  const defaultMessageFn = stdErrorMsgFn(({ value }) => `${JSON.stringify(value)} to be positive.`);

  const predicate = (value: any) => value > 0;

  messageFn = messageFn || defaultMessageFn;

  return new ValidatorPredicate(name, predicate, messageFn);
}
