# Ardito Advisors Solutions - Deployment Guide

## 🚀 Quick Start

This guide will help you deploy your Ardito Advisors Solutions EIP landing page to GitHub Pages.

---

## 📋 Prerequisites

Before deploying, make sure you have:
- ✅ Node.js and Yarn installed
- ✅ Git installed
- ✅ GitHub repository access
- ✅ All your changes saved in your code editor

---

## 🔧 Local Development

### Starting the Development Server

To work on the project locally and see changes in real-time:

```bash
# Navigate to the frontend directory
cd /Users/jamesjones/Projects/ardito/ardito-advisors-solutions/frontend

# Start the development server
yarn start
```

This will open your app at **http://localhost:3000**

The page will automatically reload when you make changes to the code.

### Stopping the Development Server

Press `Ctrl + C` in the terminal where the server is running.

---

## 🌐 Deploying to GitHub Pages

Your live site is accessible at:
**https://jamesjones-ai.github.io/Ardito-Advisors-Solutions/**

### Step-by-Step Deployment Process

#### 1. Navigate to the Project Root

```bash
cd /Users/jamesjones/Projects/ardito/ardito-advisors-solutions
```

#### 2. Check What Files Have Changed

```bash
git status
```

This shows all modified files in red.

#### 3. Stage Your Changes

Option A - Add all changes:
```bash
git add .
```

Option B - Add specific files:
```bash
git add frontend/src/pages/LandingPage.jsx
git add frontend/src/App.js
# Add other specific files as needed
```

#### 4. Commit Your Changes

```bash
git commit -m "Update landing page with credit section changes"
```

Replace the message in quotes with a description of your changes.

#### 5. Push to GitHub

```bash
git push origin main
```

This saves your code to GitHub's main branch.

#### 6. Build and Deploy to GitHub Pages

```bash
cd frontend
yarn deploy
```

**What happens:**
- Automatically runs `yarn build` to create optimized production files
- Deploys the build folder to the `gh-pages` branch
- Updates your live site at https://jamesjones-ai.github.io/Ardito-Advisors-Solutions/

#### 7. Wait and Verify

- Wait 1-2 minutes for GitHub Pages to update
- Visit https://jamesjones-ai.github.io/Ardito-Advisors-Solutions/
- Hard refresh your browser: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)

---

## 📝 Common Commands Cheat Sheet

| Task | Command |
|------|---------|
| Start local dev server | `cd frontend && yarn start` |
| Check git status | `git status` |
| Stage all changes | `git add .` |
| Commit changes | `git commit -m "your message"` |
| Push to GitHub | `git push origin main` |
| Deploy to GitHub Pages | `cd frontend && yarn deploy` |
| View live site | https://jamesjones-ai.github.io/Ardito-Advisors-Solutions/ |
| View local dev site | http://localhost:3000 |

---

## 🔍 Troubleshooting

### Changes not appearing on live site?

1. Make sure you ran `yarn deploy` in the frontend folder
2. Wait 1-2 minutes for GitHub Pages to update
3. Hard refresh your browser: `Cmd + Shift + R`
4. Check GitHub Pages settings: https://github.com/jamesjones-ai/Ardito-Advisors-Solutions/settings/pages

### Changes not appearing locally?

1. Make sure dev server is running (`yarn start`)
2. Check that you saved your files
3. Restart the dev server if needed

### Git push rejected?

```bash
# Pull latest changes first
git pull origin main

# Then push again
git push origin main
```

### Deployment failed?

```bash
# Make sure you're in the frontend directory
cd /Users/jamesjones/Projects/ardito/ardito-advisors-solutions/frontend

# Try building first to catch errors
yarn build

# If build succeeds, deploy
yarn deploy
```

---

## 📂 Project Structure

```
ardito-advisors-solutions/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── pages/
│   │   │   └── LandingPage.jsx   # Main landing page
│   │   ├── components/           # Reusable components
│   │   └── App.js               # Main app component
│   ├── public/                  # Static files
│   └── package.json            # Dependencies and scripts
└── backend/                    # Python backend (if needed)
```

---

## 🎯 Complete Workflow Example

Here's a typical workflow when making changes:

```bash
# 1. Start development server
cd /Users/jamesjones/Projects/ardito/ardito-advisors-solutions/frontend
yarn start

# 2. Make your changes in code editor
# 3. Test locally at http://localhost:3000

# 4. When satisfied, commit and deploy
cd /Users/jamesjones/Projects/ardito/ardito-advisors-solutions
git add .
git commit -m "Update landing page design"
git push origin main

# 5. Deploy to live site
cd frontend
yarn deploy

# 6. Wait 1-2 minutes and check live site
# https://jamesjones-ai.github.io/Ardito-Advisors-Solutions/
```

---

## 🆘 Need Help?

- Check if dev server is running: Look for "Compiled successfully" message
- View git history: `git log --oneline`
- View recent changes: `git diff`
- Check what's staged: `git status`

---

## 📌 Important Notes

- **Always test locally before deploying** - Run `yarn start` and test at localhost:3000
- **Commit before deploying** - Save your work to git first
- **Wait for deployment** - GitHub Pages takes 1-2 minutes to update
- **Clear cache** - Use hard refresh (Cmd+Shift+R) to see changes

---

**Last Updated:** February 2026
**Live Site:** https://jamesjones-ai.github.io/Ardito-Advisors-Solutions/
**Repository:** https://github.com/jamesjones-ai/Ardito-Advisors-Solutions
