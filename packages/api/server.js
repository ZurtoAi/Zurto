import path from "path";
import { fileURLToPath } from "url";

// Set up environment
process.env.CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || "sk-test-key";
process.env.NODE_ENV = "development";
process.env.API_PORT = "3002";

// Load the compiled backend
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendPath = path.join(__dirname, "dist", "index.js");
await import(backendPath);
