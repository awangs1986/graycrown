$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$testRoot = Join-Path $projectRoot ('.test-runtime-ai-fix-' + [guid]::NewGuid().ToString('N'))
$dataRoot = Join-Path $testRoot 'data'
New-Item -ItemType Directory -Path $testRoot | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot 'dist\GrayCrown-v2\data') -Destination $dataRoot -Recurse

$mockProcess = $null
$appProcess = $null
try {
    $mockProcess = Start-Process -FilePath 'node' -ArgumentList @(
        (Join-Path $projectRoot 'tests\mock-openai-server.mjs'),
        '42701',
        'reasoning'
    ) -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru
    $appProcess = Start-Process -FilePath (Join-Path $projectRoot 'dist\GrayCrown-v2\GrayCrown.exe') -ArgumentList @(
        '--no-open',
        '--port',
        '42700',
        '--data-dir',
        $dataRoot
    ) -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru

    $ready = $false
    for ($attempt = 0; $attempt -lt 50; $attempt++) {
        try {
            Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:42700/' -TimeoutSec 1 | Out-Null
            $ready = $true
            break
        } catch {
            Start-Sleep -Milliseconds 100
        }
    }
    if (-not $ready) { throw 'launcher did not become ready' }

    $originHeaders = @{ Origin = 'http://127.0.0.1:42700' }
    $settingsBody = @{
        apiUrl = 'http://127.0.0.1:42701/v1'
        model = 'deepseek-v4-flash'
        apiKey = 'test-key'
    } | ConvertTo-Json
    Invoke-RestMethod -Method Put -Uri 'http://127.0.0.1:42700/api/ai-settings' -Headers $originHeaders -ContentType 'application/json' -Body $settingsBody | Out-Null
    $connectionResult = Invoke-RestMethod -Method Post -Uri 'http://127.0.0.1:42700/api/ai/test' -Headers $originHeaders
    if (-not $connectionResult.ok -or $connectionResult.reply -ne 'OK') {
        throw "unexpected AI test response: $($connectionResult | ConvertTo-Json -Compress)"
    }
    $explainBody = @{
        lessonId = 'day01-q01'
        title = 'First spell'
        objective = 'Print one line'
        rules = 'Use printf'
        code = 'int main(void) { printf("Hello\n") }'
        compilerMessage = 'line 1: expected semicolon after expression'
        output = ''
    } | ConvertTo-Json
    $explainResult = Invoke-RestMethod -Method Post -Uri 'http://127.0.0.1:42700/api/ai/compiler-explain' -Headers $originHeaders -ContentType 'application/json' -Body $explainBody
    if (-not $explainResult.ok -or -not $explainResult.content) {
        throw "unexpected compiler explanation response: $($explainResult | ConvertTo-Json -Compress)"
    }
    @{ connection = $connectionResult; explanation = $explainResult } | ConvertTo-Json -Compress
} finally {
    if ($appProcess -and -not $appProcess.HasExited) { Stop-Process -Id $appProcess.Id }
    if ($mockProcess -and -not $mockProcess.HasExited) { Stop-Process -Id $mockProcess.Id }
}
