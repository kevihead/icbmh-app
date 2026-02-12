# 🚀 Deploy to Firebase Hosting

This guide will help you deploy your Next.js app to Firebase Hosting.

## 📋 Prerequisites

1. ✅ Firebase project created (you already have `icbmh-app`)
2. ✅ Firebase CLI installed globally
3. ✅ Authenticated with Firebase

---

## 🔧 Step-by-Step Deployment

### Step 1: Install Firebase CLI (if not already installed)

```powershell
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```powershell
firebase login
```

This will open your browser to authenticate with Google.

### Step 3: Initialize Firebase (if not already done)

Navigate to your app directory:
```powershell
cd c:\Users\allav\Desktop\repos\icbmh-app\app
```

Then initialize Firebase:
```powershell
firebase init hosting
```

**Select these options:**
- ✅ Use an existing project → Select `icbmh-app`
- Public directory: `out` (already configured)
- Configure as single-page app: **Yes**
- Overwrite index.html: **No**
- Set up automatic builds with GitHub: **No** (you can do this later)

### Step 4: Build Your App

```powershell
npm run build
```

This creates a static export in the `out` folder.

### Step 5: Deploy to Firebase

```powershell
firebase deploy --only hosting
```

Or use the npm script:
```powershell
npm run deploy:hosting
```

---

## 🎯 Quick Deploy (All-in-One)

After initial setup, just run:

```powershell
npm run deploy
```

This will build and deploy in one command!

---

## 🌐 Your Live URL

After deployment, your app will be available at:
```
https://icbmh-app.web.app
```
or
```
https://icbmh-app.firebaseapp.com
```

---

## ⚙️ Important: Configure Authorized Domains

After first deployment, add your Firebase domain to authorized domains:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `icbmh-app`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add:
   - `icbmh-app.web.app`
   - `icbmh-app.firebaseapp.com`
   - `localhost` (already there)

This allows Google Sign-In to work on your deployed site!

---

## 🔄 Deployment Workflow

### For Development
```powershell
npm run dev          # Test locally
```

### For Production
```powershell
npm run build        # Build the app
firebase deploy      # Deploy everything
```

### Quick Deploy
```powershell
npm run deploy       # Build + Deploy in one command
```

---

## 📊 View Your Deployment

After deploying:
```powershell
firebase hosting:channel:list
```

To see your deployed site:
```powershell
firebase open hosting:site
```

---

## 🐛 Troubleshooting

### Issue: "Firebase not found"
**Solution:** Install Firebase CLI globally:
```powershell
npm install -g firebase-tools
```

### Issue: "Not authenticated"
**Solution:** Login again:
```powershell
firebase login
```

### Issue: "Build failed"
**Solution:** Check your environment variables are set in `.env.local`

### Issue: "Google Sign-In doesn't work"
**Solution:** Add your deployed domain to Firebase Console → Authentication → Authorized domains

### Issue: "404 on page refresh"
**Solution:** Already configured in `firebase.json` with rewrites to `/index.html`

---

## 🎨 Custom Domain (Optional)

To use your own domain:

1. Go to Firebase Console → Hosting
2. Click **Add custom domain**
3. Follow the instructions to verify and connect your domain
4. Update DNS records as instructed
5. Add the custom domain to **Authentication → Authorized domains**

---

## 📝 What's Already Configured

✅ Next.js static export (`output: "export"`)
✅ Firebase hosting config (`firebase.json`)
✅ Build output directory (`out`)
✅ SPA routing (rewrites to index.html)
✅ Cache headers for assets
✅ Deploy scripts in package.json

---

## 🚀 Ready to Deploy?

Run this now:

```powershell
cd c:\Users\allav\Desktop\repos\icbmh-app\app
npm run build
firebase deploy --only hosting
```

Your app will be live in minutes! 🎉
