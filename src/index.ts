import dotenv from "dotenv";

dotenv.config(); // Load from .env

export type EnvType = "string" | "number" | "boolean" | "json" | "array";

export interface EnvRule<T> {
  type: EnvType;
  required?: boolean;
  default?: T;
  validator?: (value: T) => boolean;
}

export type EnvSchema<T> = {
  [K in keyof T]: EnvRule<T[K]>;
};

export function sanitizeEnv<T>(schema: EnvSchema<T>): T {
  const config = {} as T;

  for (const key in schema) {
    const rule = schema[key as keyof T];
    const rawValue = process.env[key];

    let finalValue: any;

    if (rawValue === undefined || rawValue === null || rawValue === "") {
      if (rule.required && rule.default === undefined) {
        throw new Error(
          `Missing required environment variable: ${String(key)}`
        );
      }
      finalValue = rule.default;
    } else {
      switch (rule.type) {
        case "string":
          finalValue = rawValue;
          break;

        case "number":
          const parsedNumber = Number(rawValue);
          if (isNaN(parsedNumber)) {
            throw new Error(
              `Environment variable ${String(key)} must be a valid number`
            );
          }
          finalValue = parsedNumber;
          break;

        case "boolean":
          finalValue = ["true", "1", "yes"].includes(rawValue.toLowerCase());
          break;

        case "json":
          try {
            finalValue = JSON.parse(rawValue);
          } catch {
            throw new Error(
              `Environment variable ${String(key)} must be valid JSON`
            );
          }
          break;

        case "array":
          finalValue = rawValue.split(",").map((item) => item.trim());
          break;

        default:
          throw new Error(`Unsupported type for env variable: ${String(key)}`);
      }
    }

    if (rule.validator && !rule.validator(finalValue)) {
      throw new Error(
        `Validation failed for environment variable: ${String(key)}`
      );
    }

    config[key as keyof T] = finalValue;
  }

  return config;
}
