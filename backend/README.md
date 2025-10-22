Backend README

MongoDB connection

Environment variables:
- MONGO_URI (required)
- MONGO_DB_NAME (optional, defaults to 'dimentia_project')
- MONGO_SKIP_TLS_VERIFY (optional, 'true' to skip TLS cert verification for dev only)
- MONGO_TLS_CA_FILE (optional, path to CA file)

Development notes:
To test the connection locally:

PowerShell example:

$env:MONGO_URI = "your-mongo-uri-here"
$env:MONGO_SKIP_TLS_VERIFY = "true"  # dev only; do NOT use in production
python .\backend\scripts\test_mongo_connect.py

Security:
Do NOT enable MONGO_SKIP_TLS_VERIFY in production environments. This disables certificate
verification and should only be used when debugging TLS issues against dev/staging clusters.
