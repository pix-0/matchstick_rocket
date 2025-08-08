# 🚀 Deployment Guide - Burnt Matchstick Detector

This guide provides multiple options to deploy your React app to various hosting platforms.

## 📋 Prerequisites

1. **Build the app locally first:**
   ```bash
   cd burnt-matchstick-detector
   npm install
   npm run build
   ```

2. **Ensure you have the following:**
   - Node.js (version 14 or higher)
   - npm or yarn
   - Git repository (for most deployments)

## 🎯 Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)

**Vercel** is the easiest option for React apps with automatic deployments.

#### Steps:
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd burnt-matchstick-detector
   vercel
   ```

3. **Follow the prompts:**
   - Login to Vercel (or create account)
   - Confirm project settings
   - Deploy

4. **Automatic deployments:**
   - Connect your GitHub repository
   - Every push to main branch will auto-deploy

#### Alternative: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Deploy automatically

**✅ Pros:** Free, automatic deployments, custom domains, SSL
**❌ Cons:** None for this use case

---

### Option 2: Netlify (Free & Easy)

**Netlify** is another excellent option for static sites.

#### Steps:
1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   cd burnt-matchstick-detector
   netlify deploy
   ```

3. **Follow the prompts:**
   - Login to Netlify
   - Choose "Create & configure a new site"
   - Set publish directory to `build`
   - Deploy

4. **For production:**
   ```bash
   netlify deploy --prod
   ```

#### Alternative: Deploy via Netlify Dashboard
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Connect your repository
5. Set build command: `npm run build`
6. Set publish directory: `build`
7. Deploy

**✅ Pros:** Free, automatic deployments, custom domains, SSL
**❌ Cons:** None for this use case

---

### Option 3: GitHub Pages (Free)

**GitHub Pages** is perfect if your code is already on GitHub.

#### Steps:
1. **Install gh-pages:**
   ```bash
   cd burnt-matchstick-detector
   npm install --save-dev gh-pages
   ```

2. **Update package.json homepage** (already done):
   ```json
   {
     "homepage": "https://yourusername.github.io/burnt-matchstick-detector"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages:**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Save

**✅ Pros:** Free, integrated with GitHub
**❌ Cons:** Requires GitHub repository, manual deployment

---

### Option 4: Firebase Hosting (Free)

**Firebase Hosting** is Google's hosting solution.

#### Steps:
1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase:**
   ```bash
   cd burnt-matchstick-detector
   firebase init hosting
   ```

4. **Follow the prompts:**
   - Use existing project or create new
   - Public directory: `build`
   - Configure as single-page app: `Yes`
   - Don't overwrite index.html: `No`

5. **Deploy:**
   ```bash
   firebase deploy
   ```

**✅ Pros:** Free, Google's infrastructure, custom domains
**❌ Cons:** Requires Google account

---

### Option 5: Heroku (Free Tier Discontinued)

**Note:** Heroku discontinued their free tier, but here's how to deploy if you have a paid account.

#### Steps:
1. **Install Heroku CLI:**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Add buildpack:**
   ```bash
   heroku buildpacks:set mars/create-react-app
   ```

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

**✅ Pros:** Easy deployment, good for full-stack apps
**❌ Cons:** No free tier, requires credit card

---

## 🔧 Custom Domain Setup

### Vercel/Netlify:
1. Go to your project dashboard
2. Settings → Domains
3. Add custom domain
4. Update DNS records as instructed

### GitHub Pages:
1. Repository Settings → Pages
2. Add custom domain
3. Create CNAME file in repository

### Firebase:
1. Firebase Console → Hosting
2. Add custom domain
3. Update DNS records

## 🚨 Troubleshooting

### Common Issues:

1. **Build fails:**
   ```bash
   npm install
   npm run build
   ```

2. **404 errors on refresh:**
   - Ensure proper routing configuration (already included in config files)

3. **Environment variables:**
   - Add them in your hosting platform's dashboard
   - Prefix with `REACT_APP_` for Create React App

4. **Performance issues:**
   - Run `npm run build` to optimize for production
   - Check bundle size with `npm run build -- --stats`

## 📊 Performance Optimization

### Before Deployment:
1. **Optimize images:**
   - Compress images
   - Use WebP format when possible

2. **Code splitting:**
   - Already handled by Create React App

3. **Lazy loading:**
   - Consider implementing for large components

### After Deployment:
1. **Monitor performance:**
   - Use Lighthouse in Chrome DevTools
   - Check Core Web Vitals

2. **Analytics:**
   - Add Google Analytics
   - Monitor user behavior

## 🎉 Success!

Your burnt matchstick detector is now live! Share the URL with others to test the app.

## 📞 Support

If you encounter issues:
1. Check the hosting platform's documentation
2. Review the troubleshooting section above
3. Check browser console for errors
4. Verify all dependencies are installed
