# Store a Sanity API token without echoing it.
# Writes ~/.config/mcp-env/<Name> (one file per secret) and upserts <Name>= in this repo's .env.
# Run from the repo root: pwsh -File scripts/set-sanity-token.ps1 [-Name SANITY_API_READ_TOKEN]
param([string]$Name = 'SANITY_API_READ_TOKEN')

$ErrorActionPreference = 'Stop'
$secure = Read-Host -AsSecureString "Paste $Name"
$token = [Runtime.InteropServices.Marshal]::PtrToStringBSTR(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)).Trim()
if (-not $token) { throw 'Empty token, nothing written.' }

$utf8 = New-Object System.Text.UTF8Encoding($false)

$dir = Join-Path $HOME '.config/mcp-env'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
[IO.File]::WriteAllText((Join-Path $dir $Name), $token, $utf8)

$envFile = Join-Path (Split-Path $PSScriptRoot -Parent) '.env'
$lines = if (Test-Path $envFile) { @(Get-Content $envFile | Where-Object { $_ -notmatch "^$Name=" }) } else { @() }
$lines += "$Name=$token"
[IO.File]::WriteAllText($envFile, (($lines -join "`n") + "`n"), $utf8)

Write-Host "Saved $Name ($($token.Length) characters) to $dir and $envFile. Restart npm run dev."
