# 🔐 Security Checklist

Quick reference for security best practices and procedures.

## 📋 Before Each Deployment

- [ ] All environment variables set in deployment platform
- [ ] No `.env` files committed to repository
- [ ] All `NEXT_PUBLIC_*` variables are intentionally client-exposed
- [ ] Secrets are stored in Doppler (not hardcoded)
- [ ] Dependencies updated and audited (`npm audit`)
- [ ] No console.log statements with sensitive data

## 🔑 Monthly Security Review

- [ ] Review all active credentials and API keys
- [ ] Check access logs for unusual activity
- [ ] Verify team member access levels
- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit fix`
- [ ] Review and update `.gitignore`

## 🚨 Quarterly Credential Rotation

- [ ] Generate new Warp API key
- [ ] Generate new OZ Environment ID
- [ ] Rotate Airtable token
- [ ] Rotate Doppler token
- [ ] Update all deployment environments
- [ ] Test application thoroughly
- [ ] Revoke old credentials
- [ ] Document rotation in security log

## 🆕 New Team Member Onboarding

- [ ] Provide access to Doppler project
- [ ] Share `.env.example` (never real credentials)
- [ ] Guide through local setup with `.env.local`
- [ ] Review security documentation
- [ ] Configure git-secrets on their machine
- [ ] Add to necessary service accounts (Airtable, etc.)

## 🚪 Team Member Offboarding

- [ ] Remove from Doppler project
- [ ] Remove from GitHub repository
- [ ] Remove from Vercel project
- [ ] Remove from Airtable workspace
- [ ] Rotate all shared credentials
- [ ] Review access logs for their period of access

## 🔍 After Security Incident

- [ ] Rotate ALL credentials immediately
- [ ] Review all access logs
- [ ] Document incident details
- [ ] Update affected services
- [ ] Notify team members
- [ ] Implement preventive measures
- [ ] Schedule follow-up security audit

## ✅ Git Security

- [ ] `.env` in `.gitignore`
- [ ] `.env.local` in `.gitignore`
- [ ] `.env*.local` in `.gitignore`
- [ ] `git-secrets` installed and configured
- [ ] GitHub secret scanning enabled
- [ ] No credentials in commit messages
- [ ] No credentials in issue/PR descriptions

## 🛡️ Environment Variable Security

### ❌ NEVER expose to client:
- `AIRTABLE_TOKEN`
- `DOPPLER_TOKEN`
- `WARP_API_KEY` (unless specifically needed client-side)
- Any API keys for server-side operations

### ⚠️ Client-exposed (use cautiously):
- `NEXT_PUBLIC_API_URL` ✅
- `NEXT_PUBLIC_APP_ENV` ✅
- `NEXT_PUBLIC_WARP_API_KEY` ⚠️ (only if absolutely necessary)
- `NEXT_PUBLIC_OZ_ENVIRONMENT_ID` ⚠️ (only if needed client-side)

## 📞 Emergency Contacts

**Security Incident:** See `docs/SECURITY.md`  
**Credential Rotation:** See `docs/SECURITY.md`  
**Access Issues:** Contact repository owner

---

**Quick Links:**
- [Full Security Documentation](../docs/SECURITY.md)
- [Issue #9: Credential Rotation](https://github.com/lauchoy/beo-automation/issues/9)
- [Environment Setup](.env.example)

**Last Updated:** 2026-02-21
