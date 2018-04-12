import { isArray, findIndex } from "lodash";

import { ValidatorPredicate } from "../../../validator";
import { ValidationErrorMessageFn, stdErrorMsgFn } from "../../../message";

export type IsInType = ValidatorPredicate<IsInOptions>;

export interface IsInOptions {
  values: any[];
}

export function IsIn(values: any[], messageFn?: ValidationErrorMessageFn): IsInType {
  const name = "IsIn";

  const defaultMessageFn = stdErrorMsgFn(
    ({ validator, value }) =>
      `${JSON.stringify(value)} to be in ${JSON.stringify((validator as IsInType).options.values)}.`,
  );

  /* 1. Validate arguments */

  if (!isArray(values)) {
    throw new TypeError(`Argument values should be an array.`);
  }

  // messageFn is validated by ValidatorPredicate

  /* 2. Arguments default */

  messageFn = messageFn || defaultMessageFn;

  /* 3. Validator */

  const predicate = (v: any, e?: IsInOptions) => isIn(e!.values, v);

  const options: IsInOptions = { values };

  return new ValidatorPredicate<IsInOptions>(name, predicate, messageFn, options);
}

function isIn(collection: any[], value: any) {
  return findIndex(collection, (x) => x === value) !== -1;
}
