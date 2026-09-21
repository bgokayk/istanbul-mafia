$ErrorActionPreference='Stop'
$gameRoot=$PSScriptRoot
$gameUrl='http://127.0.0.1:8795'
function ServerReady {
  try { $response=Invoke-WebRequest $gameUrl -UseBasicParsing -TimeoutSec 2; return $response.StatusCode -eq 200 -and $response.Content.Contains('art-v2.js') } catch { return $false }
}
if(-not (ServerReady)) {
  $nodeCommand=Get-Command node.exe -ErrorAction SilentlyContinue
  $nodePath=if($nodeCommand){$nodeCommand.Source}else{Join-Path $env:ProgramFiles 'nodejs\node.exe'}
  if(-not (Test-Path -LiteralPath $nodePath)){throw 'Node.js bulunamadi. www\index.html dosyasini tarayicida acabilirsiniz.'}
  Start-Process -FilePath $nodePath -ArgumentList 'server.cjs' -WorkingDirectory $gameRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $gameRoot 'server.log') -RedirectStandardError (Join-Path $gameRoot 'server-error.log')
  for($attempt=0;$attempt -lt 20;$attempt++) { if(ServerReady){break}; Start-Sleep -Milliseconds 300 }
  if(-not (ServerReady)){throw 'Oyun sunucusu baslatilamadi. server-error.log dosyasini kontrol edin.'}
}
Start-Process $gameUrl

