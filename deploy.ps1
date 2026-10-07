$ErrorActionPreference = 'Stop'
# Merchant-Eye one-click deploy to GitHub Pages (lb0318.github.io/merchant-eye)
# me-src  = junction to the workspace folder (03 商人思维训练体系)
# me-deploy = the git repo that GitHub Pages publishes
$deploy = 'C:\Users\LB\me-deploy'
$src    = 'C:\Users\LB\me-src'
$proxy  = 'http://127.0.0.1:7890'

git -C $deploy pull origin main --quiet
if ($LASTEXITCODE -ne 0) { git -C $deploy -c http.proxy=$proxy pull origin main --quiet }

Copy-Item (Join-Path $src 'merchant-eye-toolkit.html') (Join-Path $deploy 'index.html') -Force
Copy-Item (Join-Path $src 'sw.js')  (Join-Path $deploy 'sw.js')  -Force
Copy-Item (Join-Path $src 'manifest.json') (Join-Path $deploy 'manifest.json') -Force

# Deploy-path patch: live filename is index.html, so SW cache paths and manifest start_url must match
$enc = New-Object System.Text.UTF8Encoding($false)
$sw = (Get-Content (Join-Path $deploy 'sw.js') -Raw) -replace '/merchant-eye-toolkit\.html', './index.html'
[IO.File]::WriteAllText((Join-Path $deploy 'sw.js'), $sw, $enc)
$mf = (Get-Content (Join-Path $deploy 'manifest.json') -Raw) -replace '/merchant-eye-toolkit\.html', 'index.html' -replace '"scope": "/"', '"scope": "./"'
[IO.File]::WriteAllText((Join-Path $deploy 'manifest.json'), $mf, $enc)

git -C $deploy add -A
$changed = git -C $deploy diff --cached --name-only
if ($changed) {
    git -C $deploy commit -m "content update $(Get-Date -Format 'yyyy-MM-dd HH:mm')" --quiet
    git -C $deploy push origin main
    if ($LASTEXITCODE -ne 0) { git -C $deploy -c http.proxy=$proxy push origin main }
    if ($LASTEXITCODE -ne 0) { Write-Host 'PUSH FAILED - check network / start Clash.'; exit 1 }
    Write-Host ''
    Write-Host 'PUSHED. Open the toolkit on your phone in 1-2 minutes (check footer version).'
} else {
    Write-Host 'No changes to deploy (already up to date).'
}
