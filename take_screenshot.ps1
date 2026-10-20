$artifactDir = "C:\Users\sadio keita\.gemini\antigravity\brain\0b4ac893-4a23-4e6b-b993-4dea358ebbd4"
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outFile = Join-Path $artifactDir "landing_v2_full.png"

$argList = @(
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1440,3400",
    "--virtual-time-budget=5000",
    "--screenshot=`"$outFile`"",
    "http://localhost:4200/"
)

$proc = Start-Process -FilePath $chrome -ArgumentList $argList -Wait -PassThru -NoNewWindow

if (Test-Path $outFile) {
    $size = (Get-Item $outFile).Length
    Write-Host "SUCCESS: landing_v2_full.png ($([math]::Round($size / 1KB)) KB)"
} else {
    Write-Host "FAILED: ExitCode was $($proc.ExitCode)"
}
