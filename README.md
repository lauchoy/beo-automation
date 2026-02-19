# BEO Automation

Automation repository for Business Entity Operations

---

## Architecture Overview

This project uses a modern, cost-effective tech stack designed for scalability and developer experience:

### Core Components

#### 1. **Document Generation**
- Custom React-PDF/TSX implementation for invoices, receipts, and reports
- Full control over design and business logic
- Integration with Anvil or DocuSign for documents requiring legal e-signatures

#### 2. **Workflow Automation**
- **n8n** (self-hosted) for simple integrations, scheduled jobs, and webhook receivers
- **Custom Node.js/TypeScript** workers for core business logic and complex workflows
- Hybrid approach provides both speed and control

#### 3. **Hosting & Infrastructure**
- **Railway** for initial deployment and rapid development
- **Fly.io** migration path for scaling
- Automatic deployments via GitHub integration

#### 4. **Notifications & Communication**
- **Email:** Resend for transactional emails with React Email templates
- **SMS:** Twilio for critical notifications (OTP, alerts)
- **Backup:** AWS SES configured as fallback

#### 5. **Storage & Database**
- **Database:** Neon serverless Postgres with branching support
- **File Storage:** Cloudflare R2 (S3-compatible) for documents, images, and backups
- Automatic backups and zero-downtime migrations

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend** | Node.js/TypeScript | API and business logic |
| **Database** | Neon Postgres | Serverless SQL database |
| **File Storage** | Cloudflare R2 | Object storage |
| **Document Generation** | React-PDF | PDF rendering |
| **Workflow Engine** | n8n | Automation platform |
| **Email** | Resend | Transactional emails |
| **SMS** | Twilio | Text notifications |
| **Hosting** | Railway/Fly.io | Application hosting |
| **Monitoring** | Sentry | Error tracking |

---

## Development Workflow

### Initial Setup

1. **Week 1:** Set up Railway + Neon + R2 infrastructure
2. **Week 2:** Implement custom document generation with React-PDF
3. **Week 3:** Deploy n8n for workflow automation
4. **Week 4:** Integrate Resend for email notifications
5. **Month 2:** Add monitoring (Sentry) and optimize

### Database Branching

Neon's database branching enables CI/CD workflows for database changes:
- Create branch for each feature
- Test migrations in isolation
- Merge to main with confidence

---

## Key Features

- ✅ **Custom Document Generation** - Full control over PDF rendering and business logic
- ✅ **Hybrid Automation** - n8n for simple workflows, custom code for complex operations
- ✅ **Serverless Database** - Autoscaling Postgres with branching support
- ✅ **Modern Email Templates** - React-based email components
- ✅ **Cost-Effective Storage** - Zero egress fees with Cloudflare R2
- ✅ **Developer-Friendly** - Simple deployment and excellent DX

---

## Resources

### Documentation Links
- [Railway Docs](https://docs.railway.app/)
- [Neon Docs](https://neon.tech/docs)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [n8n Docs](https://docs.n8n.io/)
- [Resend Docs](https://resend.com/docs)
- [React-PDF Docs](https://react-pdf.org/)

---

*Last Updated: February 19, 2026*
