# Environment Variables Mapping - Quick Reference

## From Firebase Service Account JSON → Render Environment Variables

When you download the service account JSON from Firebase, map the values like this:

```
Firebase JSON Field          →  Render Environment Variable Name
==================================================================

"project_id"                 →  FIREBASE_PROJECT_ID
"private_key_id"             →  FIREBASE_PRIVATE_KEY_ID  
"private_key"                →  FIREBASE_PRIVATE_KEY
"client_email"               →  FIREBASE_CLIENT_EMAIL
"client_id"                  →  FIREBASE_CLIENT_ID
"client_x509_cert_url"       →  FIREBASE_CLIENT_CERT_URL
```

## Example Mapping

### From Firebase JSON:
```json
{
  "type": "service_account",
  "project_id": "dpcs-67de3",
  "private_key_id": "a1b2c3d4e5f6...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xyz@dpcs-67de3.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xyz%40dpcs-67de3.iam.gserviceaccount.com"
}
```

### To Render Environment Variables:

| Variable Name | Value |
|---------------|-------|
| `FIREBASE_PROJECT_ID` | `dpcs-67de3` |
| `FIREBASE_PRIVATE_KEY_ID` | `a1b2c3d4e5f6...` |
| `FIREBASE_PRIVATE_KEY` | `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"` ⚠️ **Keep quotes!** |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-xyz@dpcs-67de3.iam.gserviceaccount.com` |
| `FIREBASE_CLIENT_ID` | `123456789012345678901` |
| `FIREBASE_CLIENT_CERT_URL` | `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xyz%40dpcs-67de3.iam.gserviceaccount.com` |
| `ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` (your frontend URL) |

## ⚠️ Special Note on FIREBASE_PRIVATE_KEY

The private key must be in **one line** with `\n` characters:

✅ **Correct**:
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC...\n-----END PRIVATE KEY-----\n"
```

❌ **Wrong** (multi-line):
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASC...
-----END PRIVATE KEY-----
```

❌ **Wrong** (no quotes):
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC...\n-----END PRIVATE KEY-----\n
```

## Copy-Paste Template for Render.com

Copy this and fill in your values:

```bash
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=""
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_CLIENT_CERT_URL=
ALLOWED_ORIGINS=
```
