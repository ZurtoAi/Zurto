# AI Integration Test Script
# Quick tests for the Zurto AI backend

$API_URL = "http://localhost:3000"

Write-Host "`n🧪 Zurto AI Integration Tests`n" -ForegroundColor Cyan
Write-Host "API URL: $API_URL`n"
Write-Host ("-" * 50)

$results = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method = "GET",
        [string]$Endpoint,
        [hashtable]$Body = $null,
        [scriptblock]$Validate = $null
    )
    
    $url = "$API_URL$Endpoint"
    $start = Get-Date
    
    try {
        $params = @{
            Uri = $url
            Method = $Method
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        $duration = ((Get-Date) - $start).TotalMilliseconds
        
        if ($Validate) {
            $valid = & $Validate $response
            if (-not $valid) {
                throw "Validation failed"
            }
        }
        
        Write-Host "✅ $Name ($([math]::Round($duration))ms)" -ForegroundColor Green
        $script:results += @{ Name = $Name; Passed = $true; Duration = $duration }
        return $response
    }
    catch {
        $duration = ((Get-Date) - $start).TotalMilliseconds
        Write-Host "❌ $Name : $($_.Exception.Message)" -ForegroundColor Red
        $script:results += @{ Name = $Name; Passed = $false; Duration = $duration; Error = $_.Exception.Message }
        return $null
    }
}

# Test 1: Health Check
Test-Endpoint -Name "Health Check" -Endpoint "/health" -Validate {
    param($r) $r -ne $null
}

# Test 2: AI Status
Test-Endpoint -Name "AI Status" -Endpoint "/api/ai/status" -Validate {
    param($r) $r.success -eq $true -and $r.claude.available -eq $true
}

# Test 3: Copilot Status
Test-Endpoint -Name "Copilot Status" -Endpoint "/api/ai/copilot/status" -Validate {
    param($r) $r.success -eq $true
}

# Test 4: Basic Chat
$chatBody = @{
    messages = @(
        @{ role = "user"; content = "Say 'Hello Test!' and nothing else." }
    )
    maxTokens = 50
}
Test-Endpoint -Name "AI Chat - Basic" -Method "POST" -Endpoint "/api/ai/chat" -Body $chatBody -Validate {
    param($r) $r.success -eq $true -and $r.content -ne $null
}

# Test 5: Chat with Context
$contextBody = @{
    messages = @(
        @{ role = "system"; content = "You are a project planning assistant." }
        @{ role = "user"; content = "List 3 key steps for starting a new web project. Be brief." }
    )
    context = @{
        projectId = "test-123"
        action = "planning"
    }
    maxTokens = 300
}
Test-Endpoint -Name "AI Chat - With Context" -Method "POST" -Endpoint "/api/ai/chat" -Body $contextBody -Validate {
    param($r) $r.success -eq $true -and $r.content.Length -gt 50
}

# Test 6: Copilot Chat Action
$copilotBody = @{
    action = "chat"
    prompt = "What can you help me with?"
}
Test-Endpoint -Name "Copilot Chat Action" -Method "POST" -Endpoint "/api/ai/copilot" -Body $copilotBody -Validate {
    param($r) $r.success -eq $true
}

# Summary
Write-Host "`n$("-" * 50)"
Write-Host "`n📊 Test Summary`n" -ForegroundColor Cyan

$passed = ($results | Where-Object { $_.Passed }).Count
$failed = ($results | Where-Object { -not $_.Passed }).Count
$totalDuration = ($results | Measure-Object -Property Duration -Sum).Sum

Write-Host "Total: $($results.Count) tests"
Write-Host "Passed: $passed ✅" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "Failed: $failed ❌" -ForegroundColor Red
} else {
    Write-Host "Failed: $failed"
}
Write-Host "Duration: $([math]::Round($totalDuration))ms"

if ($failed -gt 0) {
    Write-Host "`n❌ Failed Tests:" -ForegroundColor Red
    $results | Where-Object { -not $_.Passed } | ForEach-Object {
        Write-Host "  - $($_.Name): $($_.Error)" -ForegroundColor Red
    }
}

Write-Host ""
exit $(if ($failed -gt 0) { 1 } else { 0 })
