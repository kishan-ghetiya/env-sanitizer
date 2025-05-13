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

  // Test for Date parsing
  it("should parse Date variable", () => {
    process.env.LAUNCH_DATE = "2025-04-01T00:00:00Z";

    const schema: EnvSchema<{ LAUNCH_DATE: Date }> = {
      LAUNCH_DATE: { type: "date" as EnvType, required: true },
    };

    const config = sanitizeEnv(schema);
    expect(config.LAUNCH_DATE).toEqual(new Date("2025-04-01T00:00:00Z"));
  });

  // Test for URL parsing
  it("should parse URL variable", () => {
    process.env.API_URL = "https://api.example.com";

    const schema: EnvSchema<{ API_URL: URL }> = {
      API_URL: { type: "url" as EnvType, required: true },
    };

    const config = sanitizeEnv(schema);
    expect(config.API_URL).toEqual(new URL("https://api.example.com"));
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

  // Test for email validation
  it("should pass email validation", () => {
    process.env.EMAIL_VAR = "valid@example.com";

    const schema: EnvSchema<{ EMAIL_VAR: string }> = {
      EMAIL_VAR: {
        type: "string" as EnvType,
        required: true,
        validator: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      },
    };

    const config = sanitizeEnv(schema);
    expect(config.EMAIL_VAR).toBe("valid@example.com");
  });

  // Test for UUID validation
  it("should validate UUID format", () => {
    process.env.UUID_VAR = "123e4567-e89b-12d3-a456-426614174000";

    const schema: EnvSchema<{ UUID_VAR: string }> = {
      UUID_VAR: {
        type: "string" as EnvType,
        required: true,
        validator: (val) =>
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
            val
          ),
      },
    };

    const config = sanitizeEnv(schema);
    expect(config.UUID_VAR).toBe("123e4567-e89b-12d3-a456-426614174000");
  });

  // Test for regex parsing
  it("should parse regex variable", () => {
    process.env.REGEX_VAR = "^hello.*";

    const schema: EnvSchema<{ REGEX_VAR: RegExp }> = {
      REGEX_VAR: { type: "regex" as EnvType, required: true },
    };

    const config = sanitizeEnv(schema);
    expect(config.REGEX_VAR).toBeInstanceOf(RegExp);
    expect(config.REGEX_VAR.test("hello world")).toBe(true);
  });

  // Test for BigInt parsing
  it("should parse BigInt correctly", () => {
    process.env.BIG_INT_VAR = "9007199254740991";

    const schema: EnvSchema<{ BIG_INT_VAR: bigint }> = {
      BIG_INT_VAR: { type: "bigint" as EnvType, required: true },
    };

    const config = sanitizeEnv(schema);
    expect(config.BIG_INT_VAR).toEqual(BigInt("9007199254740991"));
  });

  // Test for hex parsing
  it("should parse hex variable", () => {
    process.env.HEX_VAR = "1a";

    const schema: EnvSchema<{ HEX_VAR: number }> = {
      HEX_VAR: { type: "hex" as EnvType, required: true },
    };

    const config = sanitizeEnv(schema);
    expect(config.HEX_VAR).toBe(26); // 0x1a = 26
  });

  // Test for csv parsing
  it("should parse csv variable", () => {
    process.env.CSV_VAR = "apple,banana,cherry";
  
    const schema: EnvSchema<{ CSV_VAR: string[] }> = {
      CSV_VAR: { type: "csv" as EnvType, required: true },
    };
  
    const config = sanitizeEnv(schema);
    expect(config.CSV_VAR).toEqual(["apple", "banana", "cherry"]);
  });
  
});
