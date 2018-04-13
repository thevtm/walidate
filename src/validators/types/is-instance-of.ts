import { ValidatorPredicate } from "../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../message";

export type IsInstanceOfType = ValidatorPredicate<IsInstanceOfOptions>;

export interface IsInstanceOfOptions {
  classType: any;
}

export function IsInstanceOf(classType: any, messageFn?: ValidationErrorMessageFn): IsInstanceOfType {
  const name = "IsInstanceOf";
  const defaultMessageFn = stdErrorMsgFn(
    ({ value }) => `${JSON.stringify(value)} to be an instance of ${classType.name}.`,
  );
  const predicate = (value: any) => value instanceof classType;
  const msgFn = messageFn || defaultMessageFn;
  const options: IsInstanceOfOptions = { classType };

  return new ValidatorPredicate(name, predicate, msgFn, options);
}
