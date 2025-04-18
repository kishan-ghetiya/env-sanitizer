import { sanitizeEnv, EnvSchema, EnvType } from "env-sanitizer";

// Define the schema with types, default values, and validation
const schema: EnvSchema<{
  PORT: number;
  NODE_ENV: string;
  ENABLE_FEATURE: boolean;
  CONFIG: object; // For JSON type
  USERS: string[]; // For array type
  LAUNCH_DATE: Date; // For date type
  API_URL: URL; // For URL type
}> = {
  PORT: { type: "number" as EnvType, required: true },
  NODE_ENV: { type: "string" as EnvType, default: "production" },
  ENABLE_FEATURE: { type: "boolean" as EnvType, default: false },
  CONFIG: { type: "json" as EnvType, default: {} },
  USERS: { type: "array" as EnvType, default: [] },
  LAUNCH_DATE: { type: "date", required: true },
  API_URL: { type: "url", required: true },
};

// Load and sanitize the environment variables
const env = sanitizeEnv(schema);

console.log(env);

/*
Output example:
{
  PORT: 4000,
  NODE_ENV: "development",
  ENABLE_FEATURE: true,
  CONFIG: { apiUrl: "https://api.example.com", timeout: 5000 },
  USERS: ["john", "jane", "alice"],
  LAUNCH_DATE: new Date("2025-04-30"),
  API_URL: new URL("https://api.example.com")
}
*/
