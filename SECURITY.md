# Security Guidelines for StartFarme

## Environment Variables

### ⚠️ IMPORTANT: Never Commit .env Files

**.env files contain sensitive information and MUST NEVER be committed to Git!**

### Protected Files

The following files are automatically ignored by Git (see `.gitignore`):
- `.env`
- `.env.local`
- `.env.production`
- `.env.development`
- `.env.test`
- `.env.*` (all variants)
- `*.env` (any file ending in .env)

### Safe to Commit

These files are safe to commit (they don't contain secrets):
- `.env.example` - Template file with placeholder values
- `README.md` - Documentation
- Configuration files without secrets

### Setting Up Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your actual values:**
   ```env
   VITE_API_BASE_URL=https://api.startfarme.tn/api
   VITE_WEATHER_API_KEY=your_actual_key_here
   ```

3. **Never commit `.env` to Git:**
   - Git will automatically ignore it (via .gitignore)
   - Double-check before committing: `git status`
   - If you see `.env` in the status, DO NOT commit it!

### What's in .env Files?

Environment variables typically contain:
- API keys
- Database passwords
- Secret tokens
- Payment gateway credentials
- SMS service keys
- Other sensitive configuration

### If .env Was Accidentally Committed

If you accidentally committed a `.env` file:

1. **Remove it from Git (but keep local file):**
   ```bash
   git rm --cached .env
   git commit -m "Remove .env file from repository"
   git push
   ```

2. **If it contains secrets, rotate them immediately:**
   - Generate new API keys
   - Change passwords
   - Update all services with new credentials

3. **Clean Git history (if needed):**
   ```bash
   # Use git filter-branch or BFG Repo-Cleaner
   # This removes the file from entire Git history
   ```

### Best Practices

1. ✅ Always use `.env.example` as a template
2. ✅ Never commit `.env` files
3. ✅ Rotate secrets if accidentally exposed
4. ✅ Use different `.env` files for dev/staging/production
5. ✅ Keep `.gitignore` updated
6. ✅ Review `git status` before committing
7. ✅ Use environment-specific variable files

### Verification

Check if .env is properly ignored:
```bash
# Should show .env is ignored
git check-ignore .env

# Should show no .env files tracked
git ls-files | grep .env
```

### Production Deployment

For production:
1. Set environment variables on your hosting platform
2. Never store `.env` files in the repository
3. Use secure secret management services
4. Rotate secrets regularly

## Additional Security Measures

### API Keys
- Store in environment variables, not in code
- Use different keys for development and production
- Rotate keys regularly
- Never log API keys

### Authentication
- Use secure JWT tokens
- Implement token expiration
- Use HTTPS only in production
- Validate all user inputs

### Database
- Never commit database credentials
- Use connection strings in environment variables
- Implement proper access controls
- Use parameterized queries

### File Uploads
- Validate file types and sizes
- Scan uploaded files for malware
- Store files outside web root when possible
- Use secure file storage (S3, Cloudinary)

## Reporting Security Issues

If you discover a security vulnerability:
1. Do NOT create a public GitHub issue
2. Contact the security team directly
3. Provide detailed information about the issue
4. Allow time for the fix before public disclosure

