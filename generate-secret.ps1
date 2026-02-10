$content = Get-Content .env
$secret = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString()))
$content = $content -replace 'NEXTAUTH_SECRET="genera_un_secret_aleatorio_aqui"', "NEXTAUTH_SECRET=`"$secret`""
$content | Set-Content .env
Write-Host "Secret generado: $secret"
