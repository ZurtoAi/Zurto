#!/usr/bin/env node
require("dotenv").config({ path: ".env" });
process.env.CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || "sk-test-key";
require("./dist/index.js");
