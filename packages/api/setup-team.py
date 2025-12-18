#!/usr/bin/env python3
import json
import subprocess
import time
import sys
import requests
import os

# Start backend
print("Starting backend...")
backend_process = subprocess.Popen(
    ["node", "dist/index.js"],
    cwd="C:\\Users\\leogr\\Desktop\\Workspace\\Zurto-V3\\backend",
    env={**os.environ, "CLAUDE_API_KEY": "sk-test-key", "NODE_ENV": "development"},
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE
)

# Wait for server to start
time.sleep(3)

API_URL = "http://localhost:3002/api/auth"

try:
    # Create team
    print("\n=== Creating Team 'LeeLoo' ===")
    team_response = requests.post(
        f"{API_URL}/teams",
        json={"name": "LeeLoo", "createdBy": "admin"},
        timeout=5
    )
    team_response.raise_for_status()
    team_data = team_response.json()
    print(json.dumps(team_data, indent=2))
    
    if not team_data.get("success"):
        print("Failed to create team")
        sys.exit(1)
    
    team = team_data["data"]
    team_id = team["id"]
    print(f"\n✅ Team created: {team['name']} (ID: {team_id})")
    
    # Add member with username "LeeLoo"
    print("\n=== Inviting user 'LeeLoo' to team ===")
    member_response = requests.post(
        f"{API_URL}/teams/{team_id}/members",
        json={"username": "LeeLoo"},
        timeout=5
    )
    member_response.raise_for_status()
    member_data = member_response.json()
    print(json.dumps(member_data, indent=2))
    
    if not member_data.get("success"):
        print("Failed to add member")
        sys.exit(1)
    
    member = member_data["data"]
    print(f"\n✅ User invited: {member['username']}")
    print(f"   Team Token: {member['teamToken']}")
    print(f"\nTo login:")
    print(f"  Username: {member['username']}")
    print(f"  Team Token: {member['teamToken']}")
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
finally:
    # Keep backend running
    print("\nBackend is running. Press Ctrl+C to stop.")
    try:
        backend_process.wait()
    except KeyboardInterrupt:
        backend_process.terminate()
