$slugs = @('bullying-chat','safe-chat','social-safety','emergencies','good-manners')
foreach ($a in $slugs) {
  Write-Host "=== $a ==="
  $idx = "tools/$a/index.html"
  $app = "tools/$a/app.js"
  $strEs = "tools/$a/strings.es.js"
  $strEn = "tools/$a/strings.en.js"
  $idxT = if (Select-String -Path $idx -Pattern 'id=.transferencia|id=.transfer' -Quiet) {'SI'} else {'NO'}
  $appT = if (Select-String -Path $app -Pattern 'transferencia' -Quiet) {'SI'} else {'NO'}
  $esT  = if (Test-Path $strEs) { if (Select-String -Path $strEs -Pattern 'transferencia' -Quiet) {'SI'} else {'NO'} } else {'N/A'}
  $enT  = if (Test-Path $strEn) { if (Select-String -Path $strEn -Pattern 'transferencia' -Quiet) {'SI'} else {'NO'} } else {'N/A'}
  Write-Host "  HTML transferencia: $idxT"
  Write-Host "  app.js transferencia: $appT"
  Write-Host "  strings.es.js transferencia: $esT"
  Write-Host "  strings.en.js transferencia: $enT"
}