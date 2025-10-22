"""Diagnostic script to exercise pymongo SSL/TLS connection and print detailed errors.

Usage (PowerShell):
$env:MONGO_URI='your-uri'
$env:MONGO_SKIP_TLS_VERIFY='true'
.\venv\Scripts\Activate.ps1
python .\scripts\diagnose_ssl.py
"""
import os
import traceback
from pymongo import MongoClient

uri = os.getenv('MONGO_URI')
if not uri:
    print('MONGO_URI not set')
    raise SystemExit(1)

skip_verify = os.getenv('MONGO_SKIP_TLS_VERIFY', '').lower() == 'true'
ca_file = os.getenv('MONGO_TLS_CA_FILE')

kwargs = {
    'serverSelectionTimeoutMS': 5000,
}

# If uri indicates TLS, pass TLS kwargs
if uri.lower().startswith('mongodb+srv://') or 'tls=true' in uri.lower() or 'ssl=true' in uri.lower():
    kwargs['tls'] = True
    if ca_file:
        kwargs['tlsCAFile'] = ca_file
    else:
        try:
            import certifi
            kwargs['tlsCAFile'] = certifi.where()
        except Exception:
            pass
    if skip_verify:
        kwargs['tlsAllowInvalidCertificates'] = True

print('Connecting with kwargs:', kwargs)

try:
    client = MongoClient(uri, **kwargs)
    # trigger server selection / handshake
    print('Server info:', client.server_info())
    print('✅ Connected successfully (pymongo)')
    client.close()
except Exception:
    print('❌ Connection failed with traceback:')
    traceback.print_exc()
    if 'ssl' in str(traceback.format_exc()).lower():
        print('\nTip: SSL/TLS errors often come from network middleboxes, mismatched OpenSSL versions, or Atlas IP access list.\n')
    raise
