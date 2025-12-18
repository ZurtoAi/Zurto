/**
 * AI Integration Tests
 * Tests for copilot-bridge and backend AI routes
 */

const API_BASE_URL = process.env.API_URL || "http://localhost:3000";

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
  response?: any;
}

const results: TestResult[] = [];

async function runTest(
  name: string,
  testFn: () => Promise<any>
): Promise<TestResult> {
  const start = Date.now();
  try {
    const response = await testFn();
    const result: TestResult = {
      name,
      passed: true,
      duration: Date.now() - start,
      response,
    };
    results.push(result);
    console.log(`✅ ${name} (${result.duration}ms)`);
    return result;
  } catch (error) {
    const result: TestResult = {
      name,
      passed: false,
      duration: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    };
    results.push(result);
    console.log(`❌ ${name}: ${result.error}`);
    return result;
  }
}

// ============================================================================
// Test Functions
// ============================================================================

async function testHealthCheck(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function testAIStatus(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/ai/status`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (!data.success) throw new Error("AI status check failed");
  if (!data.claude?.available) throw new Error("Claude not available");
  return data;
}

async function testAIChat(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content:
            "Hello! Please respond with just 'Hi there!' to confirm you're working.",
        },
      ],
      maxTokens: 100,
    }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error || "Chat request failed");
  if (!data.content) throw new Error("No content in response");
  return data;
}

async function testAIChatWithContext(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful project planning assistant for a software development tool.",
        },
        {
          role: "user",
          content: "What are the key components of a modern web application?",
        },
      ],
      context: {
        projectId: "test-project-123",
        action: "architecture-help",
      },
      maxTokens: 500,
    }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error || "Chat with context failed");
  if (!data.content) throw new Error("No content in response");
  return data;
}

async function testAIChatMultiTurn(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "user", content: "My name is TestUser." },
        {
          role: "assistant",
          content: "Nice to meet you, TestUser! How can I help you today?",
        },
        { role: "user", content: "What was my name again?" },
      ],
      maxTokens: 100,
    }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error || "Multi-turn chat failed");
  if (!data.content) throw new Error("No content in response");
  // Check if the AI remembered the name
  if (!data.content.toLowerCase().includes("testuser")) {
    console.log("  ⚠️  Note: AI may not have recalled the name correctly");
  }
  return data;
}

async function testCopilotStatus(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/ai/copilot/status`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (!data.success) throw new Error("Copilot status check failed");
  return data;
}

async function testCopilotChat(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/ai/copilot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "chat",
      prompt: "What is Zurto?",
    }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (!data.success) throw new Error(data.error || "Copilot chat failed");
  return data;
}

async function testChatValidation(): Promise<any> {
  // Test with missing messages
  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const data = await response.json();
  // Should return 400 error
  if (response.status !== 400) {
    throw new Error(`Expected 400 status, got ${response.status}`);
  }
  if (data.success !== false) {
    throw new Error("Expected success: false for validation error");
  }
  return { validated: true, error: data.error };
}

// ============================================================================
// Run Tests
// ============================================================================

async function runAllTests() {
  console.log("\n🧪 AI Integration Tests\n");
  console.log(`API URL: ${API_BASE_URL}\n`);
  console.log("─".repeat(50));

  // Core health check
  await runTest("Health Check", testHealthCheck);

  // AI Status
  await runTest("AI Status Check", testAIStatus);

  // Copilot Status
  await runTest("Copilot Status", testCopilotStatus);

  // Validation
  await runTest("Chat Validation (error case)", testChatValidation);

  // Basic Chat
  await runTest("AI Chat - Basic", testAIChat);

  // Chat with Context
  await runTest("AI Chat - With Context", testAIChatWithContext);

  // Multi-turn Chat
  await runTest("AI Chat - Multi-turn", testAIChatMultiTurn);

  // Copilot Chat Action
  await runTest("Copilot Chat Action", testCopilotChat);

  // Summary
  console.log("\n" + "─".repeat(50));
  console.log("\n📊 Test Summary\n");

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`Total: ${results.length} tests`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${failed} ${failed > 0 ? "❌" : ""}`);
  console.log(`Duration: ${totalDuration}ms`);

  if (failed > 0) {
    console.log("\n❌ Failed Tests:");
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  - ${r.name}: ${r.error}`);
      });
  }

  console.log("\n");

  return { passed, failed, total: results.length };
}

// Run if executed directly
runAllTests()
  .then(({ failed }) => {
    process.exit(failed > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error("Test runner error:", error);
    process.exit(1);
  });
