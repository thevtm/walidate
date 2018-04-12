import { isObjectLike, isArray, isEmpty } from "lodash";

import { Validator } from ".";

export interface Constraints {
  [key: string]: Validator[] | Constraints;
}

export function isConstraints(value: any): boolean {
  return isObjectLike(value) && !isArray(value) && !isEmpty(value);
}
