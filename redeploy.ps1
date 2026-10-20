$docker = "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
& $docker compose up --build -d frontend
Write-Host "Deploy exit code: $LASTEXITCODE"
