$file = 'frontend\src\app\core\pages\landing\landing.component.ts'
$content = Get-Content $file -Raw -Encoding UTF8

# Fix 1: simulationResult description - remove "par IA"
$content = $content -replace [regex]::Escape('Génération assistée par IA du plan'), 'Génération du plan'

# Fix 2: objectives Digitaliser - scoring IA -> scoring financier
$content = $content -replace [regex]::Escape('scoring IA et traçabilité'), 'scoring financier et traçabilité'

# Fix 3: phase2Steps step 05 title
$content = $content -replace [regex]::Escape("'Génération automatique IA'"), "'Génération automatique du dossier'"

# Fix 4: pricingPlans Pack Premium feature
$content = $content -replace [regex]::Escape('Business Plan IA'), 'Business Plan complet'

# Fix 5: roadmapPhases Phase 3 title - IA Financière -> Analyse Financière
$content = $content -replace [regex]::Escape('IA Financière Avancée'), 'Analyse Financière Avancée'

Set-Content $file -Value $content -Encoding UTF8 -NoNewline
Write-Host 'Corrections IA appliquées avec succès.'
