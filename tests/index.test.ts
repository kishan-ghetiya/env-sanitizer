import { sanitizeEnv, EnvSchema, EnvType } from "../src/index";

describe("sanitizeEnv", () => {
  // Test for string, number, and boolean values
  it("should load string, number, and boolean values", () => {
    process.env.STRING_VAR = "hello";
    process.env.NUMBER_VAR = "99";
    process.env.BOOLEAN_VAR = "true";

    const schema: EnvSchema<{
      STRING_VAR: string;
      NUMBER_VAR: number;
      BOOLEAN_VAR: boolean;
    }> = {
      STRING_VAR: { type: "string" as EnvType, required: true },
      NUMBER_VAR: { type: "number" as EnvType, required: true },
      BOOLEAN_VAR: { type: "boolean" as EnvType, required: true },
    };

    const config = sanitizeEnv(schema);

    expect(config.STRING_VAR).toBe("hello");
    expect(config.NUMBER_VAR).toBe(99);
    expect(config.BOOLEAN_VAR).toBe(true);
  });

  // Test for default values if missing
  it("should apply default values if missing", () => {
    delete process.env.OPTIONAL_VAR;

    const schema: EnvSchema<{ OPTIONAL_VAR: string }> = {
      OPTIONAL_VAR: { type: "string" as EnvType, default: "default-value" },
    };

    const config = sanitizeEnv(schema);

    expect(config.OPTIONAL_VAR).toBe("default-value");
  });

  // Test for missing required environment variable
  it("should throw error if required value is missing", () => {
    delete process.env.REQUIRED_MISSING;

    const schema: EnvSchema<{ REQUIRED_MISSING: string }> = {
      REQUIRED_MISSING: { type: "string" as EnvType, required: true },
    };

    expect(() => sanitizeEnv(schema)).toThrow(
      "Missing required environment variable: REQUIRED_MISSING"
    );
  });

  // Test for invalid number input
  it("should throw error for invalid number", () => {
    process.env.BAD_NUMBER = "abc";

    const schema: EnvSchema<{ BAD_NUMBER: number }> = {
      BAD_NUMBER: { type: "number" as EnvType, required: true },
    };

    expect(() => sanitizeEnv(schema)).toThrow(
      "Environment variable BAD_NUMBER must be a valid number"
    );
  });

  // Test for JSON parsing
  it("should parse JSON variable", () => {
    process.env.JSON_VAR = '{"key": "value"}';

    const schema: EnvSchema<{ JSON_VAR: { key: string } }> = {
      JSON_VAR: { type: "json" as EnvType, required: true },
    };

    const config = sanitizeEnv(schema);
    expect(config.JSON_VAR).toEqual({ key: "value" });
  });

  // Test for array parsing
  it("should parse array variable", () => {
    process.env.ARRAY_VAR = "one, two, three";

    const schema: EnvSchema<{ ARRAY_VAR: string[] }> = {
      ARRAY_VAR: { type: "array" as EnvType, required: true },
    };

    const config = sanitizeEnv(schema);
    expect(config.ARRAY_VAR).toEqual(["one", "two", "three"]);
  });

  // Test for passing validation if value is valid
  it("should pass validation if value is valid", () => {
    process.env.VALID_VAR = "valid@example.com";

    const schema: EnvSchema<{ VALID_VAR: string }> = {
      VALID_VAR: {
        type: "string" as EnvType,
        required: true,
        validator: (val) => val.includes("@"),
      },
    };

    const config = sanitizeEnv(schema);
    expect(config.VALID_VAR).toBe("valid@example.com");
  });

  // Test for validation failure if value is invalid
  it("should fail validation if value is invalid", () => {
    process.env.INVALID_VAR = "invalid";

    const schema: EnvSchema<{ INVALID_VAR: string }> = {
      INVALID_VAR: {
        type: "string" as EnvType,
        required: true,
        validator: (val) => val.includes("@"),
      },
    };

    expect(() => sanitizeEnv(schema)).toThrow(
      "Validation failed for environment variable: INVALID_VAR"
    );
  });
});
