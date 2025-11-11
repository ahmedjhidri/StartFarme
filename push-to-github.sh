#!/bin/bash

# Script to push StartFarme to GitHub
# Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME

if [ -z "$1" ]; then
    echo "Usage: ./push-to-github.sh YOUR_GITHUB_USERNAME"
    echo "Example: ./push-to-github.sh johndoe"
    exit 1
fi

GITHUB_USERNAME=$1
REPO_NAME="startfarme"

echo "Setting up GitHub remote for StartFarme..."
echo "GitHub Username: $GITHUB_USERNAME"
echo "Repository: $REPO_NAME"
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "Remote 'origin' already exists. Removing it..."
    git remote remove origin
fi

# Add remote
echo "Adding remote repository..."
git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

# Verify remote
echo ""
echo "Remote configuration:"
git remote -v

# Push to GitHub
echo ""
echo "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "View your repository at: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "1. Repository exists on GitHub: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo "2. You have write access to the repository"
    echo "3. You're authenticated (use Personal Access Token for HTTPS)"
    echo ""
    echo "To create the repository, go to: https://github.com/new"
fi

