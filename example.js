import { sanitizeEnv } from "./index";

const env = sanitizeEnv({
  PORT: { type: "number", required: true },
  NODE_ENV: { type: "string", default: "production" },
  ENABLE_FEATURE: { type: "boolean", default: false },
});

console.log(env);
/*
Output:
{
  PORT: 4000,
  NODE_ENV: "development",
  ENABLE_FEATURE: true
}
*/
