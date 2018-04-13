import { entries, get } from "lodash";

import { Validator, ValidationResult, isValidators } from "../validator";
import { Constraints, isConstraints } from "../index";

import { validateValidators } from "./validate-validators";

export function validateConstraints(
  constraints: Constraints,
  value: any,
  target: any,
  propertyPath: string = "",
): ValidationResult {
  for (const [contraintsKey, contraintsValue] of entries(constraints)) {
    let validationResult;
    const path = propertyPath === "" ? contraintsKey : `${propertyPath}.${contraintsKey}`;
    const targetValue = get(value, contraintsKey);

    if (isValidators(contraintsValue)) {
      validationResult = validateValidators(contraintsValue as Validator[], targetValue, target, path);
    } else if (isConstraints(contraintsValue)) {
      validationResult = validateConstraints(contraintsValue as Constraints, targetValue, target, path);
    } else {
      throw new TypeError(`target's property "${path}" should be an Constraints or Validator[]`);
    }

    if (!validationResult.isValid) {
      return validationResult;
    }
  }

  return ValidationResult.Valid();
}
