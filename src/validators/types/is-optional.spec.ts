import { validate, ValidationResultType, IsOptional, IsNumber } from "../../index";

describe("IsOptional", () => {
  it("expect validation nominal behaviour", () => {
    /* 1. Validation */

    expect(validate([IsOptional(), IsNumber()], undefined).isValid).toBe(true);
    expect(validate([IsOptional(), IsNumber()], null).isValid).toBe(true);

    // Valid
    expect(validate([IsOptional()], false).isValid).toBe(true);
    expect(validate([IsOptional()], 1).isValid).toBe(true);
    expect(validate([IsOptional()], "bob").isValid).toBe(true);
    expect(validate([IsOptional()], new Date(1998, 12, 25)).isValid).toBe(true);
    expect(validate([IsOptional()], [1, 3]).isValid).toBe(true);
    expect(validate([IsOptional()], { x: [1, 3] }).isValid).toBe(true);

    /* 2. ValidationError */

    expect(validate([IsOptional()], undefined).error).toBeUndefined();
    expect(validate([IsOptional()], 1).error).toBeUndefined();
  });
});
