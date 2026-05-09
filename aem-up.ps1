Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
$env:NODE_EXTRA_CA_CERTS = "$env:USERPROFILE\company-certs.pem"
cmd /c "npx @adobe/aem-cli up"
