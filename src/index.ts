import dotenv from "dotenv";

dotenv.config(); // Load from .env

export type EnvType =
  | "string"
  | "number"
  | "boolean"
  | "json"
  | "array"
  | "date"
  | "object"
  | "url"
  | "email"
  | "uuid"
  | "regex"
  | "bigint"
  | "hex"
  | "csv";

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
    const rule = schema[key];
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
        case "string": {
          finalValue = rawValue;
          break;
        }

        case "number": {
          const parsedNumber = Number(rawValue);
          if (isNaN(parsedNumber)) {
            throw new Error(
              `Environment variable ${String(key)} must be a valid number`
            );
          }
          finalValue = parsedNumber;
          break;
        }

        case "boolean": {
          finalValue = ["true", "1", "yes"].includes(rawValue.toLowerCase());
          break;
        }

        case "json": {
          try {
            finalValue = JSON.parse(rawValue);
          } catch {
            throw new Error(
              `Environment variable ${String(key)} must be valid JSON`
            );
          }
          break;
        }

        case "array": {
          finalValue = rawValue.split(",").map((item) => item.trim());
          break;
        }

        case "date": {
          finalValue = new Date(rawValue);
          if (isNaN(finalValue.getTime())) {
            throw new Error(
              `Environment variable ${String(key)} must be a valid date`
            );
          }
          break;
        }

        case "object": {
          try {
            finalValue = JSON.parse(rawValue);
          } catch {
            throw new Error(
              `Environment variable ${String(key)} must be valid JSON object`
            );
          }
          break;
        }

        case "url": {
          try {
            finalValue = new URL(rawValue);
          } catch {
            throw new Error(
              `Environment variable ${String(key)} must be a valid URL`
            );
          }
          break;
        }

        case "email": {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(rawValue)) {
            throw new Error(
              `Environment variable ${String(key)} must be a valid email`
            );
          }
          finalValue = rawValue;
          break;
        }

        case "uuid": {
          const uuidRegex =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
          if (!uuidRegex.test(rawValue)) {
            throw new Error(
              `Environment variable ${String(key)} must be a valid UUID`
            );
          }
          finalValue = rawValue;
          break;
        }

        case "regex": {
          try {
            finalValue = new RegExp(rawValue);
          } catch {
            throw new Error(
              `Environment variable ${String(
                key
              )} must be a valid regular expression`
            );
          }
          break;
        }

        case "bigint": {
          const parsedBigInt = BigInt(rawValue);
          finalValue = parsedBigInt;
          break;
        }

        case "hex": {
          const parsedHex = parseInt(rawValue, 16);
          if (isNaN(parsedHex)) {
            throw new Error(
              `Environment variable ${String(key)} must be a valid hex string`
            );
          }
          finalValue = parsedHex;
          break;
        }

        case "csv": {
          finalValue = rawValue.split(",").map((item) => item.trim());
          break;
        }

        default:
          throw new Error(`Unsupported type for env variable: ${String(key)}`);
      }
    }

    if (rule.validator && !rule.validator(finalValue)) {
      throw new Error(
        `Validation failed for environment variable: ${String(key)}`
      );
    }

    config[key] = finalValue;
  }

  return config;
}
