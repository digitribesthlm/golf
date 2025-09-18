# Quick GitHub Setup Commands

If you prefer to do it manually, here are the exact commands to copy and paste:

## Option 1: Using GitHub CLI (Recommended)

```bash
# 1. Authenticate with GitHub (one-time setup)
gh auth login

# 2. Create repository and push (replace YOUR_USERNAME)
gh repo create golf --public --description "Golf distance calculator with weather conditions and player profiles"
git remote add origin https://github.com/YOUR_USERNAME/golf.git
git push -u origin main
```

## Option 2: Manual GitHub Setup

1. **Go to GitHub.com** and create a new repository named `golf`
2. **Make it public** with description: "Golf distance calculator with weather conditions and player profiles"
3. **Don't initialize** with README (we already have one)
4. **Copy the repository URL** (should be: `https://github.com/YOUR_USERNAME/golf.git`)
5. **Run these commands:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/golf.git
git push -u origin main
```

## Option 3: Use the Script

```bash
# Run the automated script
./push-to-github.sh
```

## What Gets Uploaded

Your repository will contain:
- ✅ Complete Next.js source code
- ✅ Player profile system
- ✅ Weather calculations
- ✅ Mobile-responsive design
- ✅ README with setup instructions
- ✅ All components and utilities

## After Upload

Your golf calculator will be available at:
- **Live App**: [Your deployed URL]
- **Source Code**: `https://github.com/YOUR_USERNAME/golf`

Replace `YOUR_USERNAME` with your actual GitHub username!

