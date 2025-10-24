# 📋 Environment Variables Quick Copy-Paste Guide

## For Render.com Deployment

### Step 1: Download Firebase Service Account JSON
```
Firebase Console → Your Project → ⚙️ Settings → Service Accounts → Generate New Private Key
```

### Step 2: Copy-Paste Each Value to Render

Open your downloaded JSON file and copy each value to Render's environment variables section:

---

#### Variable 1: FIREBASE_PROJECT_ID
**From JSON field**: `project_id`
```json
"project_id": "dpcs-67de3"
```
**Copy to Render**:
```
Variable Name:  FIREBASE_PROJECT_ID
Value:          dpcs-67de3
```

---

#### Variable 2: FIREBASE_PRIVATE_KEY_ID
**From JSON field**: `private_key_id`
```json
"private_key_id": "a1b2c3d4e5f6g7h8i9j0..."
```
**Copy to Render**:
```
Variable Name:  FIREBASE_PRIVATE_KEY_ID
Value:          a1b2c3d4e5f6g7h8i9j0...
```

---

#### Variable 3: FIREBASE_PRIVATE_KEY ⚠️ SPECIAL
**From JSON field**: `private_key`
```json
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
```
**Copy to Render** (KEEP THE QUOTES!):
```
Variable Name:  FIREBASE_PRIVATE_KEY
Value:          "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
```

⚠️ **CRITICAL**: 
- Include the double quotes at the beginning and end
- Keep `\n` as is (don't replace with newlines)
- Copy the ENTIRE key including BEGIN and END markers

---

#### Variable 4: FIREBASE_CLIENT_EMAIL
**From JSON field**: `client_email`
```json
"client_email": "firebase-adminsdk-xyz@dpcs-67de3.iam.gserviceaccount.com"
```
**Copy to Render**:
```
Variable Name:  FIREBASE_CLIENT_EMAIL
Value:          firebase-adminsdk-xyz@dpcs-67de3.iam.gserviceaccount.com
```

---

#### Variable 5: FIREBASE_CLIENT_ID
**From JSON field**: `client_id`
```json
"client_id": "123456789012345678901"
```
**Copy to Render**:
```
Variable Name:  FIREBASE_CLIENT_ID
Value:          123456789012345678901
```

---

#### Variable 6: FIREBASE_CLIENT_CERT_URL
**From JSON field**: `client_x509_cert_url`
```json
"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xyz%40dpcs-67de3.iam.gserviceaccount.com"
```
**Copy to Render**:
```
Variable Name:  FIREBASE_CLIENT_CERT_URL
Value:          https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xyz%40dpcs-67de3.iam.gserviceaccount.com
```

---

#### Variable 7: ALLOWED_ORIGINS (Custom)
**Your frontend URL(s)**:
```
Variable Name:  ALLOWED_ORIGINS
Value:          https://your-frontend.vercel.app
```

For multiple URLs, separate with commas:
```
Value:          https://your-frontend.vercel.app,https://other-domain.com
```

---

## Visual Example

```
Firebase JSON File                   Render Environment Variables
├─ project_id          ───────────▶  FIREBASE_PROJECT_ID
├─ private_key_id      ───────────▶  FIREBASE_PRIVATE_KEY_ID
├─ private_key         ───────────▶  FIREBASE_PRIVATE_KEY (with quotes!)
├─ client_email        ───────────▶  FIREBASE_CLIENT_EMAIL
├─ client_id           ───────────▶  FIREBASE_CLIENT_ID
└─ client_x509_cert_url ──────────▶  FIREBASE_CLIENT_CERT_URL
                                   
(Your frontend URL)    ───────────▶  ALLOWED_ORIGINS
```

---

## Verification Checklist

After adding all variables to Render:

- [ ] All 7 environment variables are set
- [ ] `FIREBASE_PRIVATE_KEY` has double quotes at start and end
- [ ] `FIREBASE_PRIVATE_KEY` contains `\n` (not actual newlines)
- [ ] No extra spaces or line breaks in values
- [ ] `ALLOWED_ORIGINS` has your actual frontend URL

---

## What Success Looks Like

After deployment, your Render logs should show:

```
🔌 Connecting to Firebase Firestore...
✅ Successfully connected to Firebase Firestore!
INFO:     Application startup complete.
```

## What Failure Looks Like

❌ If you see errors like:
```
❌ Failed to connect to Firebase
```

→ Double-check environment variables, especially `FIREBASE_PRIVATE_KEY` format

---

## Need Help?

- Detailed guide: `FIREBASE_ENV_SETUP.md`
- Troubleshooting: `DEPLOYMENT_CHECKLIST.md`
- Overview: `MIGRATION_COMPLETE.md`
