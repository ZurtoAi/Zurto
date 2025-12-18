$env:NODE_ENV = "development"
$env:CLAUDE_API_KEY = "sk-test-key"
$env:API_PORT = "3002"
$env:DB_PATH = "./data/zurto.db"

cd "C:\Users\leogr\Desktop\Workspace\Zurto-V3\backend"
node dist/index.js
