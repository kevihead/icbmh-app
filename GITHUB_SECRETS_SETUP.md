# GitHub Secrets Setup Guide

Your Firebase credentials are already protected locally (`.env.local` is in `.gitignore`), but if you want to deploy your app or use GitHub Actions, you'll need to set up GitHub Secrets.

## ✅ Local Development (Already Done!)
Your `.env.local` file is **already protected** from being committed to GitHub because it's listed in `.gitignore`.

## 🔒 GitHub Secrets for Deployment/CI/CD

If you deploy your app (e.g., to Vercel, Netlify, or use GitHub Actions), follow these steps:

### Option 1: Vercel Deployment (Recommended)
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable from your `.env.local` file:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
4. Redeploy your app

### Option 2: GitHub Actions Secrets
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each environment variable:
   - Name: `FIREBASE_API_KEY`
   - Value: `AIzaSyBSPPVTXMUSf9EPned6Zx3atEZi4gWMcFQ`
   - (Repeat for each variable)

5. In your GitHub Actions workflow file, reference them like:
   ```yaml
   env:
     NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
     # ... etc
   ```

## 📝 Important Notes

### Are Firebase API Keys "Secret"?
Firebase API keys in `NEXT_PUBLIC_*` variables are **publicly exposed** in your client-side code. This is expected and safe because:
- They identify your Firebase project
- Security is handled by Firebase Security Rules
- They're meant to be public (they're in your browser's JavaScript)

### What IS Actually Secret?
- Your `.env.local` file should still not be committed (it's in `.gitignore`)
- **Firebase Admin SDK** private keys (server-side only)
- Database passwords
- OAuth client secrets

### Security Best Practices
1. ✅ Set up **Firebase Security Rules** (most important!)
2. ✅ Enable **Firebase App Check** to prevent abuse
3. ✅ Set up **authorized domains** in Firebase Console
4. ✅ Never commit server-side credentials

## 🔥 Enable Firebase Authentication

Don't forget to enable authentication in your Firebase Console:
1. Go to https://console.firebase.google.com/
2. Select your project: `icbmh-app`
3. Click **Authentication** → **Get Started**
4. Enable **Email/Password** provider
5. Enable **Google** provider (add authorized domains)

## 🚀 Testing Your Setup

After setting up everything, restart your dev server:
```bash
npm run dev
```

Your sign-in and register buttons should now work!
