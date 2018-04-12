import { ValidationError } from "./validation-error";

export enum ValidationResultType {
  Valid,
  Invalid,
  ValidSkip,
}

export class ValidationResult {
  public static Valid(): ValidationResult {
    return new ValidationResult(ValidationResultType.Valid);
  }

  public static Invalid(error: ValidationError): ValidationResult {
    return new ValidationResult(ValidationResultType.Invalid, error);
  }

  public static ValidSkip(): ValidationResult {
    return new ValidationResult(ValidationResultType.ValidSkip);
  }

  public readonly _type: ValidationResultType;

  public readonly error?: ValidationError;

  private constructor(type: ValidationResultType, error?: ValidationError) {
    this._type = type;
    this.error = error;
  }

  public get isValid(): boolean {
    return this._type !== ValidationResultType.Invalid;
  }

  public get isInvalid(): boolean {
    return !this.isValid;
  }
}
