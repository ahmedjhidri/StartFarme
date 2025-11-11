# GitHub Repository Setup

## Step 1: Create Repository on GitHub

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+ (+)"** icon in the top right
3. Select **"New repository"**
4. Repository name: `startfarme` (or your preferred name)
5. Description: `AgriTech platform for Tunisian farmers`
6. Choose **Public** or **Private**
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click **"Create repository"**

## Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see instructions. Use these commands:

### Option 1: If repository is empty (recommended)

```bash
cd ~/Documents/startfarme
git remote add origin https://github.com/YOUR_USERNAME/startfarme.git
git branch -M main
git push -u origin main
```

### Option 2: If you already have a GitHub repository URL

```bash
cd ~/Documents/startfarme
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and `YOUR_REPOSITORY_URL` with your actual repository URL.

## Step 3: Verify Push

After pushing, verify on GitHub:
- Go to your repository page
- You should see all the files
- Check that the commit message is visible in the commit history

## Troubleshooting

### If you get "remote origin already exists":
```bash
git remote remove origin
git remote add origin YOUR_REPOSITORY_URL
```

### If you need to use SSH instead of HTTPS:
```bash
git remote add origin git@github.com:YOUR_USERNAME/startfarme.git
```

### If you get authentication errors:
- For HTTPS: Use a Personal Access Token instead of password
- For SSH: Set up SSH keys on GitHub

## Quick Commands Reference

```bash
# Check remote
git remote -v

# Push to GitHub
git push -u origin main

# Push future changes
git push

# Pull changes
git pull

# Check status
git status
```

