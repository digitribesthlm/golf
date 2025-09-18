#!/bin/bash

echo "🚀 Golf Calculator - GitHub Push Script"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the golf project directory"
    exit 1
fi

echo "📋 This script will:"
echo "1. Create a new GitHub repository called 'golf'"
echo "2. Push all your code to GitHub"
echo ""

# Prompt for GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GitHub username is required"
    exit 1
fi

echo ""
echo "🔧 Setting up GitHub repository..."

# Create repository using GitHub CLI
echo "Creating repository on GitHub..."
gh repo create golf --public --description "Golf distance calculator with weather conditions and player profiles"

if [ $? -eq 0 ]; then
    echo "✅ Repository created successfully!"
else
    echo "❌ Failed to create repository. Please check your GitHub CLI authentication."
    echo "Run: gh auth login"
    exit 1
fi

# Add remote and push
echo "🔗 Adding remote origin..."
git remote add origin https://github.com/$GITHUB_USERNAME/golf.git

echo "📤 Pushing code to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your golf calculator is now on GitHub!"
    echo "📍 Repository URL: https://github.com/$GITHUB_USERNAME/golf"
    echo ""
    echo "🔗 You can now:"
    echo "   • View your code: https://github.com/$GITHUB_USERNAME/golf"
    echo "   • Clone it anywhere: git clone https://github.com/$GITHUB_USERNAME/golf.git"
    echo "   • Share it with others"
    echo "   • Accept contributions"
else
    echo "❌ Failed to push to GitHub. Please check your authentication."
fi

