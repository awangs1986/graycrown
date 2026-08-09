$ErrorActionPreference = 'Stop'

$ProjectRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$DistRoot = [System.IO.Path]::GetFullPath((Join-Path $ProjectRoot 'dist'))
$PackageRoot = Join-Path $DistRoot 'GrayCrown-v2'

if (-not $DistRoot.StartsWith($ProjectRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "The distribution path is outside the project: $DistRoot"
}

Push-Location $ProjectRoot
try {
    npm run build:web
    cargo build --release

    if (Test-Path -LiteralPath $DistRoot) {
        Remove-Item -LiteralPath $DistRoot -Recurse -Force
    }
    New-Item -ItemType Directory -Path (Join-Path $PackageRoot 'data') -Force | Out-Null

    Copy-Item -LiteralPath (Join-Path $ProjectRoot 'target\release\gray-crown-launcher.exe') -Destination (Join-Path $PackageRoot 'GrayCrown.exe')
    Copy-Item -LiteralPath (Join-Path $ProjectRoot 'data\app') -Destination (Join-Path $PackageRoot 'data\app') -Recurse
    Copy-Item -LiteralPath (Join-Path $ProjectRoot 'README.txt') -Destination $PackageRoot
    Copy-Item -LiteralPath (Join-Path $ProjectRoot 'THIRD_PARTY_NOTICES.txt') -Destination $PackageRoot
    Copy-Item -LiteralPath (Join-Path $ProjectRoot 'lesson-regression-report.md') -Destination $PackageRoot

    $Archive = Join-Path $DistRoot 'GrayCrown-v2-Windows-x64.zip'
    Compress-Archive -LiteralPath $PackageRoot -DestinationPath $Archive -CompressionLevel Optimal

    Write-Host "Portable package: $PackageRoot"
    Write-Host "Archive: $Archive"
}
finally {
    Pop-Location
}
