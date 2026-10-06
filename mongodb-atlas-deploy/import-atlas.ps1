# RugOS: import json-export/*.json into MongoDB Atlas
# Usage:
#   .\import-atlas.ps1 -Uri "mongodb+srv://USER:PASS@CLUSTER.mongodb.net/rugos"
# Requires: mongoimport (MongoDB Database Tools) on PATH

param(
  [Parameter(Mandatory = $true)]
  [string]$Uri
)

$ErrorActionPreference = "Stop"
$exportDir = Join-Path $PSScriptRoot "json-export"

if (-not (Get-Command mongoimport -ErrorAction SilentlyContinue)) {
  Write-Error "mongoimport not found. Install MongoDB Database Tools and add to PATH."
}

$collections = @(
  "users",
  "plans",
  "tenants",
  "subscriptions",
  "orders",
  "inventoryitems",
  "tenantappstates",
  "stockledgers",
  "auditlogs"
)

foreach ($name in $collections) {
  $file = Join-Path $exportDir "$name.json"
  if (-not (Test-Path $file)) {
    Write-Warning "Skip missing: $file"
    continue
  }
  Write-Host "Importing $name ..."
  & mongoimport --uri $Uri --collection $name --file $file --jsonArray --drop
}

Write-Host "Done. Check Atlas → Browse Collections → rugos"
