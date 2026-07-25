# Clasificacion canonica segun doc/es/SPEC.md seccion 3.6.b
$habilidadPura = @(
  'blocks','builders','catch','checkers','chess','coloring','connect-dots',
  'connect-four','differences','domino','ecos','emotions','fit','keyboard-typing',
  'oca','pairs','path','piano-keys','puzzle','stories','tic-tac-toe','tracing',
  'turns-mirrors','visual-sudoku','where-is'
)
$simulacion = @(
  'be-prepared','bullying-chat','calm','categories','clock','colored-spelling',
  'comedy-club','dictionary','doctor-visit','double-meaning','emergencies',
  'first-aid-kit','friends','good-manners','healthy-food','house','idioms',
  'math-tables','my-agenda','my-body','my-details','numbers','odd-one-out',
  'patterns','phone-numbers','post-or-not','quantities','resilience','riddles',
  'roman-numerals','routines','safe-chat','self-esteem','sentence',
  'sexual-health','shop','shopping','signs','situations','social-safety',
  'spelling','street','task-list','theatre','times-of-day','trust-circle',
  'vocabulary','wallet','what-do-i-need','what-first','whats-missing',
  'what-to-wear','where-to-store','while-help-arrives','words','word-search'
)

$slugs = Get-ChildItem -Directory tools | Where-Object { Test-Path "$($_.FullName)\app.js" } | ForEach-Object { $_.Name } | Sort-Object
$sim_ok=$sim_T=$sim_S=$sim_ninguno=0
$hab_ok=$hab_T=$hab_S=$hab_ninguno=0
$brechas = @()
foreach ($a in $slugs) {
  $app="tools/$a/app.js"; $str="tools/$a/strings.es.js"; $idx="tools/$a/index.html"
  $hasT='NO'
  # requiere: nodo en index.html + texto en strings + escritura en app.js
  $idxHas = Select-String -Path $idx -Pattern 'id="transferencia"|id="transfer"' -Quiet
  $strHas = if (Test-Path $str) { Select-String -Path $str -Pattern 'transferencia' -Quiet } else { $false }
  $appHas = Select-String -Path $app -Pattern 'transferencia' -Quiet
  if ($idxHas -and $strHas -and $appHas) { $hasT='SI' }
  # Cableado socratico real: mostrarPista*/mostrarExplicacion* (cualquier variante),
  # pista/explicacion como campo del item, o zonas #explicacion*/#pista* en el DOM.
  $hasS = 'NO'
  if (Select-String -Path $app -Pattern 'mostrarPista|mostrarExplicacion|op\.pista|op\.explicacion|item\.pista|item\.explicacion' -Quiet) { $hasS = 'SI' }
  elseif (Select-String -Path $idx -Pattern 'id="pista|id="explicacion|#pista[^a-zA-Z]|#explicacion[^a-zA-Z]' -Quiet) { $hasS = 'SI' }
  $tipo = if ($simulacion -contains $a) { 'SIM' } elseif ($habilidadPura -contains $a) { 'HAB' } else { '?' }
  if ($tipo -eq 'SIM') {
    if ($hasT -eq 'SI' -and $hasS -eq 'SI') { $sim_ok++ }
    elseif ($hasT -eq 'NO' -and $hasS -eq 'NO') { $sim_ninguno++; $brechas += "[SIM] $a -> falta T y S (contrato vacio)" }
    else {
      if ($hasT -eq 'NO') { $sim_T++; $brechas += "[SIM] $a -> falta transferencia (obligatoria)" }
      if ($hasS -eq 'NO') { $sim_S++; $brechas += "[SIM] $a -> falta cableado socratico (obligatorio)" }
    }
  } elseif ($tipo -eq 'HAB') {
    if ($hasT -eq 'NO' -and $hasS -eq 'NO') { $hab_ninguno++ }
    elseif ($hasT -eq 'NO') { $hab_T++ }
    elseif ($hasS -eq 'NO') { $hab_S++ }
    else { $hab_ok++ }
  } else { $brechas += "[???] $a no clasificada en SPEC 3.6.b" }
}

Write-Host "=== SIMULACION (contrato completo obligatorio) ==="
Write-Host "Catalogadas: $($simulacion.Count) | Cumplen T+S: $sim_ok | Solo falta T: $sim_T | Solo falta S: $sim_S | Faltan ambos: $sim_ninguno"
Write-Host ""
Write-Host "=== HABILIDAD PURA (T/S cuando aporten) ==="
Write-Host "Catalogadas: $($habilidadPura.Count) | Cumplen: $hab_ok | Solo sin T: $hab_T | Solo sin S: $hab_S | Sin T ni S: $hab_ninguno"
Write-Host ""
Write-Host "=== BRECHAS REALES (orden de prioridad) ==="
$brechas | Sort-Object | ForEach-Object { Write-Host "  $_" }
$brechas | Sort-Object | Out-File -FilePath scripts/audit-contratos-brechas.txt -Encoding utf8

# CSV detalle por actividad (para revisar manualmente)
$csv = @()
foreach ($a in $slugs) {
  $app="tools/$a/app.js"; $str="tools/$a/strings.es.js"; $idx="tools/$a/index.html"
  $tApp = (Select-String -Path $app -Pattern 'transferencia' -Quiet)
  $tStr = if (Test-Path $str) { Select-String -Path $str -Pattern 'transferencia' -Quiet } else { $false }
  $tIdx = Select-String -Path $idx -Pattern 'id="transferencia"|id="transfer"' -Quiet
  $sApp = Select-String -Path $app -Pattern 'mostrarPista|mostrarExplicacion|op\.pista|op\.explicacion|item\.pista|item\.explicacion' -Quiet
  $sIdx = Select-String -Path $idx -Pattern 'id="pista|id="explicacion|#pista[^a-zA-Z]|#explicacion[^a-zA-Z]' -Quiet
  $tipo = if ($simulacion -contains $a) { 'SIM' } elseif ($habilidadPura -contains $a) { 'HAB' } else { 'NO_CLAS' }
  $csv += [PSCustomObject]@{
    slug=$a; tipo=$tipo; t_html=[bool]$tIdx; t_strings=[bool]$tStr; t_app=[bool]$tApp; s_app=[bool]$sApp; s_html=[bool]$sIdx
  }
}
$csv | Export-Csv -Path scripts/audit-contratos.csv -NoTypeInformation -Encoding utf8
Write-Host ""
Write-Host "CSV detallado: scripts/audit-contratos.csv"