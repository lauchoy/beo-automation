# 🔐 Security Documentation

## Overview

This document outlines security best practices and procedures for managing credentials, secrets, and sensitive data in the BEO Automation platform.

## 🚨 Emergency: Credential Exposure Response

If you suspect credentials have been exposed (committed to Git, shared publicly, etc.):

### Immediate Actions (Within 1 Hour)

1. **Rotate ALL potentially exposed credentials immediately:**
   - Warp API Keys
   - OZ Environment IDs
   - Airtable tokens
   - Doppler tokens
   - Any other API keys or secrets

2. **Update credentials in all environments:**
   - Local development (`.env.local`)
   - Doppler secrets manager
   - Vercel/hosting platform environment variables
   - CI/CD pipeline secrets (if applicable)

3. **Review access logs:**
   - Check for unauthorized API usage
   - Review Airtable access logs
   - Check Doppler audit logs
   - Review application logs for suspicious activity

4. **Document the incident:**
   - What was exposed
   - How long it was exposed
   - What actions were taken
   - Impact assessment

## 🔑 Credential Management

### Credential Inventory

| Credential | Purpose | Rotation Frequency | Storage Location |
|------------|---------|-------------------|------------------|
| `WARP_API_KEY` | Warp API authentication | Every 90 days | Doppler + Vercel |
| `OZ_ENVIRONMENT_ID` | OZ environment identifier | On change | Doppler + Vercel |
| `AIRTABLE_TOKEN` | Airtable API access | Every 90 days | Doppler + Vercel |
| `DOPPLER_TOKEN` | Doppler API access | Every 90 days | Vercel only |

### Credential Rotation Procedure

#### 1. Warp API Key Rotation

```bash
# Step 1: Generate new Warp API key
# Contact your Warp API provider or generate via their dashboard

# Step 2: Update in Doppler
doppler secrets set WARP_API_KEY="new_warp_api_key" --project beo-automation --config prd
doppler secrets set NEXT_PUBLIC_WARP_API_KEY="new_warp_api_key" --project beo-automation --config prd

# Step 3: Update in Vercel
vercel env add WARP_API_KEY production
vercel env add NEXT_PUBLIC_WARP_API_KEY production

# Step 4: Trigger redeployment
vercel --prod

# Step 5: Verify functionality
curl https://your-domain.com/api/health

# Step 6: Revoke old key
# Contact Warp API provider to revoke the old key
```

#### 2. OZ Environment ID Rotation

```bash
# Step 1: Generate new OZ Environment ID
# Contact your OZ provider or generate via their dashboard

# Step 2: Update in Doppler
doppler secrets set OZ_ENVIRONMENT_ID="new_environment_id" --project beo-automation --config prd
doppler secrets set NEXT_PUBLIC_OZ_ENVIRONMENT_ID="new_environment_id" --project beo-automation --config prd

# Step 3: Update in Vercel
vercel env add OZ_ENVIRONMENT_ID production
vercel env add NEXT_PUBLIC_OZ_ENVIRONMENT_ID production

# Step 4: Redeploy and verify
vercel --prod
```

#### 3. Airtable Token Rotation

```bash
# Step 1: Create new Personal Access Token
# Visit: https://airtable.com/create/tokens

# Step 2: Update in Doppler
doppler secrets set AIRTABLE_TOKEN="new_token" --project beo-automation --config prd

# Step 3: Update in Vercel
vercel env add AIRTABLE_TOKEN production

# Step 4: Redeploy
vercel --prod

# Step 5: Revoke old token in Airtable dashboard
```

## 🔒 Environment Variable Security

### Classification

**🔴 NEVER expose to client (Server-only):**
- `AIRTABLE_TOKEN`
- `DOPPLER_TOKEN`
- Any API keys for server-side operations

**🟡 Client-exposed (use with caution):**
- `NEXT_PUBLIC_WARP_API_KEY` (if client needs direct API access)
- `NEXT_PUBLIC_OZ_ENVIRONMENT_ID` (if client needs to identify environment)
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_ENV`

### Rules for NEXT_PUBLIC_* Variables

⚠️ **WARNING**: Any variable prefixed with `NEXT_PUBLIC_` is embedded in the client-side JavaScript bundle and visible to anyone who inspects your website.

**Only use `NEXT_PUBLIC_` prefix if:**
1. The value MUST be accessible in browser JavaScript
2. The value is not sensitive (or is a public-facing identifier)
3. You understand it will be visible in browser DevTools and page source

**Best Practice:**
- Use server-side API routes for sensitive operations
- Keep sensitive keys server-only
- Use `NEXT_PUBLIC_` only for truly public configuration

## 🚀 Deployment Security

### Vercel Configuration

1. **Set Environment Variables:**
   ```bash
   # Production
   vercel env add WARP_API_KEY production
   vercel env add OZ_ENVIRONMENT_ID production
   vercel env add AIRTABLE_TOKEN production
   vercel env add DOPPLER_TOKEN production
   
   # Preview (optional)
   vercel env add WARP_API_KEY preview
   # ... repeat for other variables
   
   # Development (optional)
   vercel env add WARP_API_KEY development
   # ... repeat for other variables
   ```

2. **Use Doppler Integration (Recommended):**
   - Install Doppler Vercel integration
   - Link your Doppler project to Vercel
   - Secrets automatically sync from Doppler → Vercel

3. **Environment-Specific Configs:**
   - Production: Use production-grade credentials
   - Preview: Use staging/preview credentials
   - Development: Use development credentials

### CI/CD Security (When Implemented)

When you add GitHub Actions or other CI/CD:

1. **Use GitHub Secrets:**
   ```bash
   # Set via GitHub UI: Settings → Secrets and variables → Actions
   # Or via GitHub CLI:
   gh secret set WARP_API_KEY --body "value"
   gh secret set OZ_ENVIRONMENT_ID --body "value"
   ```

2. **Use environment protection rules:**
   - Require approvals for production deployments
   - Restrict who can deploy to production

3. **Rotate CI/CD credentials separately:**
   - Different keys for CI/CD vs production
   - Principle of least privilege

## 🛡️ Git Security

### Prevent Credential Commits

1. **Use pre-commit hooks:**
   ```bash
   # Install git-secrets
   brew install git-secrets  # macOS
   
   # Initialize in repo
   git secrets --install
   git secrets --register-aws
   
   # Add custom patterns
   git secrets --add 'wk-[0-9]\.[a-f0-9]{64}'
   git secrets --add '[a-f0-9]{32}'
   ```

2. **Enable GitHub Secret Scanning:**
   - Already enabled for public repos
   - For private repos: Settings → Security → Secret scanning

3. **Review `.gitignore`:**
   ```gitignore
   # Ensure these are present
   .env
   .env.local
   .env*.local
   .vercel
   *.pem
   ```

### If Credentials Were Committed

1. **Remove from Git history:**
   ```bash
   # Use BFG Repo-Cleaner (easiest)
   brew install bfg
   bfg --replace-text passwords.txt
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   
   # Force push (⚠️ WARNING: Rewrites history)
   git push --force --all
   ```

2. **Notify team:**
   - All contributors must re-clone the repository
   - Old clones contain the exposed credentials

3. **Rotate all exposed credentials immediately**

## 📊 Security Monitoring

### Regular Audits

**Weekly:**
- [ ] Review Vercel deployment logs
- [ ] Check Airtable API usage
- [ ] Review Doppler access logs

**Monthly:**
- [ ] Audit all environment variables
- [ ] Review team access permissions
- [ ] Check for unused credentials (remove them)
- [ ] Update this security documentation

**Quarterly:**
- [ ] Rotate all credentials (even if not exposed)
- [ ] Security dependency audit: `npm audit`
- [ ] Review and update `.gitignore`
- [ ] Penetration testing (if applicable)

### Alerts to Configure

1. **GitHub Security Alerts:**
   - Enable Dependabot alerts
   - Enable secret scanning
   - Enable code scanning

2. **Vercel Alerts:**
   - Failed deployments
   - High error rates
   - Unusual traffic patterns

3. **Airtable Alerts:**
   - Unusual API usage
   - Failed authentication attempts

4. **Doppler Alerts:**
   - Secret access
   - Configuration changes
   - New project members

## 📖 Resources

### Documentation
- [Doppler Security Best Practices](https://docs.doppler.com/docs/best-practices)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Airtable API Security](https://airtable.com/developers/web/api/authentication)

### Tools
- [git-secrets](https://github.com/awslabs/git-secrets) - Prevent committing secrets
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) - Remove secrets from Git history
- [truffleHog](https://github.com/trufflesecurity/trufflehog) - Scan for secrets in Git repos

## 🆘 Support

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Contact the repository owner directly
3. Email: [Your security contact email]
4. Provide details of the vulnerability
5. Allow reasonable time for response before public disclosure

## 📝 Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-02-21 | Initial security documentation created | Jimmy Lauchoy |
| 2026-02-21 | Updated .env.example with placeholder values | Jimmy Lauchoy |

---

**Last Updated:** February 21, 2026  
**Next Review:** March 21, 2026  
**Owner:** Jimmy Lauchoy
