@echo off
SET NODE_TLS_REJECT_UNAUTHORIZED=0
SET NODE_OPTIONS=--tls-min-v1.0
npx @adobe/aem-cli up
