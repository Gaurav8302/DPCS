# Firebase Environment Variables Setup Guide

## Required Environment Variables for Render.com Deployment

To deploy your application on Render.com with Firebase, you need to set the following environment variables. Get these values from your Firebase service account JSON file.

### Step 1: Download Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ > **Project Settings**
4. Navigate to **Service Accounts** tab
5. Click **Generate new private key**
6. Download the JSON file (keep it secure!)

### Step 2: Extract Values from JSON

The downloaded JSON file will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com"
}
```

### Step 3: Add Environment Variables to Render.com

In your Render.com service dashboard, add these environment variables:

| Variable Name | Value from JSON | Example | Notes |
|---------------|----------------|---------|-------|
| `FIREBASE_PROJECT_ID` | `project_id` | `dpcs-67de3` | Your Firebase project ID |
| `FIREBASE_PRIVATE_KEY_ID` | `private_key_id` | `abc123def456...` | The private key identifier |
| `FIREBASE_PRIVATE_KEY` | `private_key` | `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"` | **MUST be wrapped in double quotes** and keep `\n` as-is |
| `FIREBASE_CLIENT_EMAIL` | `client_email` | `firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com` | Service account email |
| `FIREBASE_CLIENT_ID` | `client_id` | `123456789` | Client identifier |
| `FIREBASE_CLIENT_CERT_URL` | `client_x509_cert_url` | `https://www.googleapis.com/robot/v1/metadata/x509/...` | Certificate URL |
| `ALLOWED_ORIGINS` | Custom | `https://your-frontend.vercel.app` | Your frontend domain(s) separated by commas |

### Step 4: Critical Notes for FIREBASE_PRIVATE_KEY

⚠️ **IMPORTANT**: The private key requires special handling:

1. **Keep the newline characters**: Don't replace `\n` with actual newlines
2. **Wrap in double quotes**: The entire value should be in quotes
3. **Include BEGIN and END markers**: Copy the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

**Correct Format:**
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Incorrect Format:**
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
-----END PRIVATE KEY-----
```

### Step 5: Enable Firestore in Firebase

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose production mode (or test mode for development)
4. Select a region close to your users
5. Click **Enable**

### Step 6: Set Firestore Security Rules (Optional but Recommended)

In Firestore Database > Rules, set appropriate security rules. For server-side access only:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes from server-side with admin SDK
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

The Firebase Admin SDK (which your backend uses) bypasses these rules and has full access.

### Step 7: Verify Setup

After deployment, check your Render logs for:

```
🔌 Connecting to Firebase Firestore...
✅ Successfully connected to Firebase Firestore!
```

If you see errors, check:
- All environment variables are set correctly
- Private key format is correct (with quotes and `\n`)
- Firestore is enabled in your Firebase project
- Service account has proper permissions

### Local Development Setup

Create a `.env` file in the `backend` directory:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/...
ALLOWED_ORIGINS=http://localhost:3000
```

### Troubleshooting

**Error: "Failed to connect to Firebase"**
- Check that all environment variables are set
- Verify the private key format (quotes and newlines)
- Ensure Firestore is enabled in Firebase Console

**Error: "Authentication failed"**
- Verify the client email and private key match
- Check that the service account has proper permissions

**Error: "Permission denied"**
- For server-side, this shouldn't happen with Admin SDK
- If it does, regenerate the service account key

### Security Best Practices

1. **Never commit** the service account JSON file to Git
2. **Rotate keys** periodically (every 90 days recommended)
3. **Use different** service accounts for dev/staging/production
4. **Monitor usage** in Firebase Console > Usage & billing
5. **Set up alerts** for unusual activity

### Need Help?

- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Render Environment Variables](https://render.com/docs/environment-variables)
