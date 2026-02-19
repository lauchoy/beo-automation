# BEO Automation

Automation repository for Business Entity Operations

---

## Cost Tracker

### Overview
This section provides a comprehensive analysis of third-party service alternatives for each automation component, including pricing models, estimated costs, and build vs buy recommendations.

---

## 1. Document Generation

### Service Comparison

| Service | Pricing Model | Est. Monthly Cost | Integration Complexity | Key Features |
|---------|--------------|-------------------|----------------------|--------------|
| **DocuSign** | Per envelope: $0.50-$1.00<br>Plans: $10-$65/user/month | $100-$500 | ⭐⭐⭐ Medium | E-signatures, templates, workflows, audit trails |
| **PDFMonkey** | Pay-as-you-go: $29/1000 docs<br>Plans: $49-$249/month | $50-$250 | ⭐⭐ Low | Simple templates, API-first, JSON data binding |
| **Anvil** | $0.10/filled PDF<br>Plans: $50-$500/month | $100-$500 | ⭐⭐⭐ Medium | PDF filling, e-signatures, workflow automation |
| **PandaDoc** | $19-$49/user/month | $150-$400 | ⭐⭐⭐ Medium | Document analytics, CRM integration, templates |
| **Docuseal** | Open source (self-hosted)<br>Cloud: $29-$99/month | $0-$100 | ⭐⭐⭐⭐ High | Open source, customizable, self-hosted option |
| **Custom (TSX/React-PDF)** | Development time + hosting | $20-$50 | ⭐⭐⭐⭐⭐ Very High | Full control, custom logic, no per-document costs |

### Pros & Cons

#### DocuSign
**Pros:**
- Industry standard, highly trusted
- Extensive legal compliance features
- Strong audit trails and security
- Wide integration ecosystem

**Cons:**
- Expensive at scale
- Complex API, steep learning curve
- Overkill for simple PDF generation
- Per-envelope costs add up quickly

#### PDFMonkey
**Pros:**
- Simple API, fast integration
- Template-based approach
- Predictable pricing
- Good for high-volume simple documents

**Cons:**
- Limited customization
- No e-signature capability
- Less control over rendering
- Template editor limitations

#### Anvil
**Pros:**
- Combined PDF filling + e-signatures
- Developer-friendly API
- Good documentation
- Reasonable pricing for moderate volume

**Cons:**
- Still costly at high volume
- Lock-in to proprietary platform
- Limited styling options
- US-focused (compliance)

#### Custom TSX/React-PDF
**Pros:**
- Complete control over design and logic
- No per-document costs
- Can optimize for specific use cases
- No vendor lock-in
- Full stack integration

**Cons:**
- High initial development time
- Maintenance overhead
- Need to handle rendering edge cases
- Requires expertise in PDF generation
- You own the bugs

### Monthly Cost Estimates by Volume

| Documents/Month | PDFMonkey | Anvil | DocuSign | Custom Implementation |
|-----------------|-----------|-------|----------|----------------------|
| 100 | $29 | $50 | $50-100 | $20 (hosting) |
| 500 | $49 | $50 | $250-500 | $20 (hosting) |
| 1,000 | $49 | $100 | $500-1000 | $25 (hosting) |
| 5,000 | $149 | $500 | $2500-5000 | $50 (hosting) |
| 10,000 | $249 | $500+ | $5000-10000 | $75 (hosting) |

### Recommendation: **Custom TSX Rendering + Selective Integration**

**Strategy:**
- **Build:** Core document generation using React-PDF/TSX for invoices, receipts, reports
- **Buy:** Use Anvil or DocuSign only for documents requiring legal e-signatures
- **Breakeven:** ~1000 documents/month

**Rationale:**
- Most automation documents don't need e-signatures
- Custom implementation provides full control
- Costs remain predictable as you scale
- Can add e-signature service only when needed
- Total monthly cost: $20-100 vs $250-1000+

---

## 2. Workflow Automation

### Service Comparison

| Service | Pricing Model | Est. Monthly Cost | Integration Complexity | Key Features |
|---------|--------------|-------------------|----------------------|--------------|
| **Zapier** | $19.99-$799/month<br>By tasks (750-50K+) | $50-$300 | ⭐ Very Low | Massive app ecosystem, no-code, 6000+ integrations |
| **Make** (Integromat) | $9-$299/month<br>By operations (1K-100K+) | $30-$200 | ⭐⭐ Low | Visual workflow builder, powerful data transformation |
| **n8n** | Open source (self-hosted)<br>Cloud: $20-$320/month | $0-$150 | ⭐⭐⭐⭐ High | Self-hosted option, code-friendly, extensible |
| **Temporal** | Self-hosted free<br>Cloud: $200+/month | $50-$500 | ⭐⭐⭐⭐⭐ Very High | Durable workflows, developer-focused, fault-tolerant |
| **Retool Workflows** | $10/user + usage | $30-$150 | ⭐⭐ Low | Integrated with Retool apps, scheduled & event-driven |
| **Custom (Node.js/TypeScript)** | Development + hosting | $20-$100 | ⭐⭐⭐⭐⭐ Very High | Full control, custom business logic, no limits |

### Pros & Cons

#### Zapier
**Pros:**
- Fastest time to value (minutes)
- Huge integration library
- Non-technical users can build
- Reliable infrastructure
- Great for simple automations

**Cons:**
- Expensive per-task pricing
- Limited logic capabilities
- Vendor lock-in
- Debugging can be painful
- Costs scale linearly with usage

#### Make (Integromat)
**Pros:**
- More affordable than Zapier
- Better data transformation tools
- Visual flow builder intuitive
- Good for complex multi-step workflows
- More operations per dollar

**Cons:**
- Smaller integration ecosystem than Zapier
- Learning curve for complex scenarios
- Still vendor lock-in
- Execution limits can be restrictive

#### n8n
**Pros:**
- Self-hostable (cost control)
- Developer-friendly
- Code nodes for custom logic
- Growing community
- Fair cloud pricing

**Cons:**
- Self-hosting requires DevOps
- Smaller integration library
- Less mature than competitors
- Need technical expertise
- Community support vs enterprise

#### Custom Implementation
**Pros:**
- Full control over logic
- No per-execution costs
- Can optimize for your use cases
- Direct database access
- No integration limits

**Cons:**
- High development time
- Need to build all integrations
- Maintenance overhead
- Requires experienced developers
- Must handle errors, retries, monitoring

### Monthly Cost Estimates by Task Volume

| Tasks/Month | Zapier | Make | n8n Cloud | n8n Self-hosted | Custom |
|-------------|--------|------|-----------|-----------------|--------|
| 1,000 | $20 | $9 | $20 | $15 | $25 |
| 5,000 | $50 | $29 | $50 | $20 | $35 |
| 10,000 | $70 | $49 | $80 | $25 | $50 |
| 50,000 | $300 | $149 | $250 | $50 | $75 |
| 100,000 | $600 | $299 | $320 | $75 | $100 |

### Recommendation: **Hybrid Approach - n8n + Custom**

**Strategy:**
- **Use n8n (self-hosted) for:** Simple integrations, scheduled jobs, webhook receivers
- **Build custom for:** Core business logic, complex workflows, high-frequency automations
- **Budget:** $50-150/month total

**Rationale:**
- n8n handles 80% of simple automation needs
- Custom code for performance-critical workflows
- Self-hosting keeps costs low at scale
- Can migrate n8n workflows to custom as needed
- Best of both worlds: speed + control

---

## 3. Hosting & Infrastructure

### Service Comparison

| Service | Pricing Model | Est. Monthly Cost | Integration Complexity | Key Features |
|---------|--------------|-------------------|----------------------|--------------|
| **Railway** | Pay-as-you-go<br>$5/month usage + resources | $20-$150 | ⭐⭐ Low | Simple deployment, database included, fair pricing |
| **Heroku** | $7-$25/dyno + addons | $50-$300 | ⭐ Very Low | Mature ecosystem, many addons, easy setup |
| **Vercel** | Free-$20/user (hobby/pro)<br>Functions: pay-per-execution | $0-$150 | ⭐ Very Low | Edge functions, excellent DX, serverless |
| **AWS Lambda + RDS** | Pay per execution + storage | $30-$200 | ⭐⭐⭐⭐ High | Scalable, pay for what you use, AWS ecosystem |
| **Render** | $7-$25/service | $30-$150 | ⭐⭐ Low | Simple like Heroku, better pricing, modern DX |
| **Fly.io** | Pay-as-you-go<br>~$3/GB RAM/month | $20-$100 | ⭐⭐⭐ Medium | Edge deployment, global distribution, Docker-based |
| **DigitalOcean App Platform** | $5-$12/month/service | $25-$100 | ⭐⭐ Low | Predictable pricing, simple, database included |

### Pros & Cons

#### Railway
**Pros:**
- Simple pricing model
- Great DX, fast deployments
- Includes database (Postgres)
- GitHub integration
- Fair resource allocation

**Cons:**
- Relatively new platform
- Smaller community
- Limited addons vs Heroku
- Less enterprise features

#### Heroku
**Pros:**
- Battle-tested, stable
- Massive addon ecosystem
- Excellent documentation
- Easy rollbacks
- Industry standard

**Cons:**
- Expensive for resources
- Older architecture
- Addon costs add up quickly
- Eco dynos sleep (free tier removed)
- Not cost-effective at scale

#### Vercel
**Pros:**
- Excellent for Next.js/frontend
- Built-in CDN
- Edge functions
- Great free tier
- Serverless by default

**Cons:**
- Function execution limits
- Not ideal for long-running tasks
- Database not included
- Costs can spike with traffic
- Limited backend capabilities

#### AWS Lambda + RDS
**Pros:**
- Extremely scalable
- Pay only for execution
- Full AWS ecosystem
- Enterprise features
- Can be very cheap for low traffic

**Cons:**
- Complex setup and configuration
- Cold start issues
- Steep learning curve
- Need to manage many services
- Easy to misconfigure and overspend

#### Render
**Pros:**
- Heroku-like DX, better pricing
- Free tier for databases
- Background workers included
- Good documentation
- Modern infrastructure

**Cons:**
- Smaller ecosystem than Heroku
- Some features still in beta
- Less proven at scale
- Limited regions

### Monthly Cost Estimates by Scale

| Scale | Railway | Heroku | Vercel + DB | AWS Lambda | Render | Fly.io |
|-------|---------|--------|-------------|------------|--------|--------|
| **Prototype** (1 app, small DB) | $20 | $50 | $25 | $15 | $15 | $15 |
| **Small** (2-3 services, DB) | $50 | $150 | $75 | $40 | $50 | $40 |
| **Medium** (5 services, replicas) | $100 | $300 | $150 | $80 | $100 | $75 |
| **Large** (10+ services, HA) | $250 | $600 | $300 | $200 | $250 | $150 |

### Recommendation: **Railway for MVP, Migrate to Fly.io at Scale**

**Strategy:**
- **Start:** Railway ($20-50/month) for rapid development
- **Scale:** Migrate to Fly.io ($75-150/month) when traffic increases
- **Monitoring:** Add Railway's built-in monitoring, consider Sentry

**Rationale:**
- Railway offers fastest time to production
- Fair pricing for early stage
- Fly.io provides better economics at scale
- Both have excellent DX
- Easy migration path
- Total cost: $20-150/month vs $300-600+ on Heroku

---

## 4. Notifications & Communication

### Service Comparison

| Service | Pricing Model | Est. Monthly Cost | Integration Complexity | Key Features |
|---------|--------------|-------------------|----------------------|--------------|
| **SendGrid** | Free: 100/day<br>Paid: $15-$90/month | $15-$90 | ⭐⭐ Low | Email API, templates, analytics, deliverability |
| **Mailgun** | Pay-as-you-go: $0.80/1000<br>Plans: $35-$90/month | $35-$90 | ⭐⭐ Low | Developer-focused, validation, powerful routing |
| **Postmark** | $15/month (10K emails) | $15-$100 | ⭐⭐ Low | Transactional focused, excellent deliverability |
| **AWS SES** | $0.10/1000 emails | $5-$30 | ⭐⭐⭐ Medium | Cheapest option, AWS integration, scalable |
| **Resend** | Free: 3K/month<br>Paid: $20-$200/month | $0-$100 | ⭐ Very Low | Modern DX, React email, simple API |
| **Twilio** (SMS) | Pay-per-message: $0.0075-$0.04 | $50-$300 | ⭐⭐ Low | SMS, voice, WhatsApp, programmable |
| **Courier** | Free: 10K/month<br>Paid: $75-$500/month | $0-$200 | ⭐⭐ Low | Multi-channel (email, SMS, push), unified API |

### Pros & Cons

#### SendGrid
**Pros:**
- Generous free tier (100/day = 3000/month)
- Good deliverability
- Template editor
- Marketing email features
- Analytics dashboard

**Cons:**
- API can be complex
- Marketing focus vs transactional
- Support quality varies
- Template language is dated

#### Mailgun
**Pros:**
- Developer-friendly API
- Excellent documentation
- Email validation included
- Good for transactional emails
- Flexible routing rules

**Cons:**
- No free tier
- More expensive than AWS SES
- Dashboard could be better
- Limited template features

#### Postmark
**Pros:**
- Laser-focused on transactional
- Best-in-class deliverability
- Beautiful delivery insights
- Template editor
- Excellent support

**Cons:**
- More expensive per email
- No marketing features
- Overkill for simple needs
- US-centric

#### AWS SES
**Pros:**
- Extremely cheap ($0.10/1000)
- Scales infinitely
- AWS ecosystem integration
- High send limits after verification

**Cons:**
- Requires AWS knowledge
- Setup complexity
- Need to manage bounce/complaint handling
- Dashboard is basic
- Warmup period required

#### Resend
**Pros:**
- Modern, excellent DX
- React Email templates
- Generous free tier
- Simple, clean API
- Fast growing

**Cons:**
- Newer service (less proven)
- Smaller feature set
- Limited advanced features
- Growing pains possible

#### Twilio
**Pros:**
- Reliable SMS delivery
- Global coverage
- Multi-channel (SMS, voice, WhatsApp)
- Excellent documentation
- Programmable workflows

**Cons:**
- Can get expensive at scale
- Per-message pricing adds up
- Compliance requirements vary by region
- Need to handle opt-outs carefully

### Monthly Cost Estimates by Volume

| Volume | SendGrid | Postmark | AWS SES | Resend | Twilio SMS (1000 msgs) |
|--------|----------|----------|---------|--------|------------------------|
| 3,000 emails | Free | $15 | $0.30 | Free | - |
| 10,000 emails | $15 | $15 | $1 | Free | - |
| 50,000 emails | $60 | $75 | $5 | $20 | - |
| 100,000 emails | $90 | $150 | $10 | $100 | - |
| 1,000 SMS | - | - | - | - | $10-40 |
| 5,000 SMS | - | - | - | - | $50-200 |

### Recommendation: **Resend for Email + Twilio for SMS**

**Strategy:**
- **Email:** Start with Resend free tier (3K/month), upgrade as needed
- **SMS:** Use Twilio only for critical notifications (OTP, alerts)
- **Fallback:** Keep AWS SES configured for backup
- **Budget:** $0-50/month initially, $50-150/month at scale

**Rationale:**
- Resend has best DX for developers
- React Email templates are modern and maintainable
- Free tier covers most MVP needs
- Twilio is reliable for SMS (use sparingly)
- AWS SES as backup keeps costs low
- Total cost: $0-150/month vs $200-400+ with legacy providers

---

## 5. Storage & Database

### Service Comparison

| Service | Pricing Model | Est. Monthly Cost | Integration Complexity | Key Features |
|---------|--------------|-------------------|----------------------|--------------|
| **Railway Postgres** | Included with Railway<br>$5/GB storage | $10-$50 | ⭐ Very Low | Included with hosting, automatic backups |
| **Supabase** | Free: 500MB<br>Paid: $25-$1250/month | $0-$100 | ⭐⭐ Low | Postgres + auth + storage + realtime, full backend |
| **PlanetScale** | Free: 5GB<br>Paid: $29-$229/month | $0-$100 | ⭐⭐ Low | Serverless MySQL, branching, excellent DX |
| **AWS RDS** | $15-$500+/month | $50-$300 | ⭐⭐⭐⭐ High | Managed databases, many engines, enterprise features |
| **Neon** | Free: 10GB<br>Paid: $19-$199/month | $0-$100 | ⭐⭐ Low | Serverless Postgres, branching, autoscaling |
| **AWS S3** | $0.023/GB storage<br>+ transfer costs | $5-$50 | ⭐⭐⭐ Medium | Object storage, CDN integration, cheap at scale |
| **Cloudflare R2** | $0.015/GB<br>Zero egress fees | $3-$30 | ⭐⭐⭐ Medium | S3-compatible, no egress fees, Cloudflare CDN |
| **DigitalOcean Spaces** | $5/month (250GB) | $5-$25 | ⭐⭐ Low | S3-compatible, CDN included, simple pricing |

### Pros & Cons

#### Railway Postgres
**Pros:**
- Included with hosting platform
- Zero configuration
- Automatic backups
- Simple pricing
- Easy access from apps

**Cons:**
- Limited database features
- No read replicas
- Basic monitoring
- Tied to Railway platform

#### Supabase
**Pros:**
- Complete backend solution
- Auth + database + storage + edge functions
- Realtime subscriptions
- Generous free tier
- Great DX

**Cons:**
- Can be overkill for simple needs
- Learning curve for full platform
- Pricing jumps at scale
- Less control than self-hosted

#### PlanetScale
**Pros:**
- Database branching (CI/CD for DB)
- Serverless scaling
- No downtime migrations
- Excellent tooling
- Great for development workflow

**Cons:**
- MySQL only (not Postgres)
- Foreign keys limitation
- Pricing can escalate
- Vendor lock-in to branching workflow

#### Neon
**Pros:**
- True serverless Postgres
- Database branching
- Autoscaling (scale to zero)
- Great free tier
- Modern architecture

**Cons:**
- Relatively new
- Some Postgres features limited
- Cold start for scaled-down databases
- Growing pains as platform matures

#### Cloudflare R2
**Pros:**
- S3-compatible API
- Zero egress fees (huge savings)
- Cloudflare CDN integration
- Very cheap
- Global edge network

**Cons:**
- Fewer features than S3
- Newer service
- Smaller ecosystem
- Limited regional control

### Monthly Cost Estimates by Scale

| Scale | Railway DB | Supabase | Neon | S3 Storage (100GB) | R2 Storage (100GB) |
|-------|-----------|----------|------|-------------------|-------------------|
| **MVP** (1GB DB, 10GB files) | $10 | Free | Free | $3 | $2 |
| **Small** (5GB DB, 50GB files) | $25 | Free | Free | $5 | $3 |
| **Medium** (20GB DB, 200GB files) | $50 | $25 | $19 | $10 | $6 |
| **Large** (100GB DB, 1TB files) | $150 | $100 | $69 | $30 | $20 |

### Recommendation: **Neon + Cloudflare R2**

**Strategy:**
- **Database:** Neon serverless Postgres (free tier for MVP)
- **File Storage:** Cloudflare R2 for documents, images, backups
- **Backups:** Use Neon's built-in backups + R2 for long-term archive
- **Budget:** $0-25/month initially, $50-100/month at scale

**Rationale:**
- Neon's free tier is generous for MVP
- Database branching excellent for development
- R2 eliminates egress costs (huge savings)
- Both scale well without vendor lock-in anxiety
- Combined cost: $0-100/month vs $200-400+ on AWS

---

## Build vs Buy Decision Matrix

### Decision Framework

| Factor | Weight | Build Score | Buy Score | Winner |
|--------|--------|-------------|-----------|--------|
| **Document Generation** |  |  |  |  |
| Initial time to market | 20% | 3/10 | 9/10 | Buy (for MVP) |
| Long-term cost (<10K docs/mo) | 30% | 9/10 | 5/10 | Build |
| Customization needs | 25% | 10/10 | 4/10 | Build |
| Maintenance burden | 25% | 5/10 | 9/10 | Buy |
| **Recommendation** |  |  |  | **Build Custom** |
|  |  |  |  |  |
| **Workflow Automation** |  |  |  |  |
| Initial time to market | 25% | 4/10 | 10/10 | Buy |
| Long-term cost (>10K tasks/mo) | 20% | 8/10 | 4/10 | Build |
| Logic complexity | 30% | 10/10 | 6/10 | Build |
| Non-technical user access | 25% | 2/10 | 10/10 | Buy |
| **Recommendation** |  |  |  | **Hybrid (n8n + Custom)** |
|  |  |  |  |  |
| **Hosting** |  |  |  |  |
| Time to deploy | 40% | 5/10 | 10/10 | Buy |
| Cost efficiency | 30% | 7/10 | 8/10 | Buy |
| Control & flexibility | 20% | 9/10 | 7/10 | Buy |
| Maintenance burden | 10% | 4/10 | 9/10 | Buy |
| **Recommendation** |  |  |  | **Buy (Railway/Fly.io)** |
|  |  |  |  |  |
| **Notifications** |  |  |  |  |
| Initial time to market | 35% | 4/10 | 10/10 | Buy |
| Deliverability | 30% | 3/10 | 9/10 | Buy |
| Cost (<50K emails/mo) | 20% | 8/10 | 9/10 | Buy |
| Customization | 15% | 10/10 | 6/10 | Build |
| **Recommendation** |  |  |  | **Buy (Resend/SES)** |
|  |  |  |  |  |
| **Storage** |  |  |  |  |
| Time to implement | 30% | 6/10 | 9/10 | Buy |
| Cost efficiency | 35% | 7/10 | 8/10 | Buy |
| Reliability | 25% | 6/10 | 10/10 | Buy |
| Feature set | 10% | 7/10 | 9/10 | Buy |
| **Recommendation** |  |  |  | **Buy (Neon + R2)** |

---

## Recommended Architecture & Budget

### Phase 1: MVP (0-6 months, <100 users)

| Component | Service | Monthly Cost | Notes |
|-----------|---------|--------------|-------|
| **Hosting** | Railway | $20-40 | Web + worker + DB |
| **Document Generation** | Custom React-PDF | $0 | Included in hosting |
| **Workflow Automation** | n8n (self-hosted on Railway) | $0 | Included in hosting |
| **Email** | Resend (free tier) | $0 | 3K emails/month free |
| **SMS** (optional) | Twilio | $20-50 | Pay per use |
| **File Storage** | Cloudflare R2 | $3-5 | Very cheap |
| **Monitoring** | Railway + Sentry (free tier) | $0 | Basic monitoring |
| **Total MVP Cost** |  | **$23-95/month** | 🎯 Target: <$100/mo |

### Phase 2: Growth (6-18 months, 100-1000 users)

| Component | Service | Monthly Cost | Notes |
|-----------|---------|--------------|-------|
| **Hosting** | Railway or Fly.io | $75-150 | Scaled services |
| **Document Generation** | Custom + Anvil (signatures) | $25-75 | Anvil for e-signatures only |
| **Workflow Automation** | n8n + custom workers | $30-50 | Hybrid approach |
| **Email** | Resend or AWS SES | $20-50 | Scaled email |
| **SMS** | Twilio | $50-100 | More notifications |
| **File Storage** | Cloudflare R2 | $10-20 | Scaled storage |
| **Database** | Neon Pro | $19-69 | Better performance |
| **Monitoring** | Sentry + Railway | $25-50 | Paid monitoring |
| **Total Growth Cost** |  | **$254-564/month** | 🎯 Target: <$600/mo |

### Phase 3: Scale (18+ months, 1000+ users)

| Component | Service | Monthly Cost | Notes |
|-----------|---------|--------------|-------|
| **Hosting** | Fly.io or AWS | $200-400 | Multi-region, HA |
| **Document Generation** | Custom | $50-100 | Optimized infrastructure |
| **Workflow Automation** | Custom workers | $50-100 | More control needed |
| **Email** | AWS SES + Resend | $30-75 | High volume |
| **SMS** | Twilio | $100-200 | Scaled notifications |
| **File Storage** | Cloudflare R2 | $30-75 | Large storage |
| **Database** | Neon Scale or AWS RDS | $100-300 | Production database |
| **Monitoring** | Sentry + Datadog | $100-200 | Full observability |
| **CDN** | Cloudflare | $20-50 | Global distribution |
| **Total Scale Cost** |  | **$680-1500/month** | 🎯 Target: <$2000/mo |

---

## Key Insights & Recommendations

### 1. **Document Generation: Build Custom**
- **Breakeven Point:** 1,000 documents/month
- **ROI:** 6 months of development time pays off in 12-18 months
- **Action:** Start with React-PDF, add Anvil only for e-signatures

### 2. **Workflow Automation: Start with n8n, Custom for Complex**
- **Breakeven Point:** 50,000 tasks/month
- **ROI:** Use n8n for 80% of workflows, custom for 20% critical paths
- **Action:** Self-host n8n on Railway, migrate heavy workflows to custom

### 3. **Hosting: Railway → Fly.io Migration Path**
- **Breakeven Point:** ~$150/month in hosting costs
- **ROI:** Railway for speed, Fly.io for scale
- **Action:** Start Railway, plan Fly.io migration at 500+ users

### 4. **Notifications: Buy, But Cheap**
- **Breakeven Point:** Never worth building
- **ROI:** Resend free tier → AWS SES at scale
- **Action:** Use Resend, set up SES as backup

### 5. **Storage: Always Buy**
- **Breakeven Point:** Never worth building
- **ROI:** R2 eliminates egress costs
- **Action:** Use Cloudflare R2 from day one

---

## Total Cost Summary

| Phase | Users | Monthly Cost | Cost per User | Comparison to All-SaaS |
|-------|-------|--------------|---------------|------------------------|
| MVP | 0-100 | $25-95 | $0.25-0.95 | **80% cheaper** ($500+) |
| Growth | 100-1K | $250-565 | $0.25-0.56 | **70% cheaper** ($1500+) |
| Scale | 1K-10K | $680-1500 | $0.07-0.15 | **60% cheaper** ($3500+) |

### Savings at Scale
- **Traditional SaaS Stack:** $3,500-5,000/month at 10K users
- **Recommended Hybrid:** $680-1,500/month at 10K users
- **Annual Savings:** $24,000-42,000

---

## Decision Checklist

Use this checklist when evaluating build vs buy:

- [ ] Will you exceed 1,000 documents/month? → Consider custom generation
- [ ] Do you need e-signatures? → Buy (Anvil/DocuSign)
- [ ] Do you need complex workflows? → Start with n8n
- [ ] Do you have DevOps expertise? → Self-host n8n and Postgres
- [ ] Is email deliverability critical? → Buy (Postmark/SendGrid)
- [ ] Do you need SMS? → Buy (Twilio), use sparingly
- [ ] Are you scaling globally? → Use Fly.io + Cloudflare
- [ ] Do you need realtime features? → Consider Supabase
- [ ] Is cost the primary concern? → Choose: Neon + R2 + Railway

---

## Next Steps

1. **Week 1:** Set up Railway + Neon + R2 (MVP stack)
2. **Week 2:** Implement custom document generation with React-PDF
3. **Week 3:** Deploy n8n for workflow automation
4. **Week 4:** Integrate Resend for email notifications
5. **Month 2:** Add monitoring (Sentry) and optimize costs
6. **Month 6:** Review usage and plan Fly.io migration if needed

---

## Resources

### Documentation Links
- [Railway Docs](https://docs.railway.app/)
- [Neon Docs](https://neon.tech/docs)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [n8n Docs](https://docs.n8n.io/)
- [Resend Docs](https://resend.com/docs)
- [React-PDF Docs](https://react-pdf.org/)

### Cost Calculators
- [AWS Pricing Calculator](https://calculator.aws/)
- [Vercel Pricing](https://vercel.com/pricing)
- [Railway Pricing](https://railway.app/pricing)

---

*Last Updated: February 19, 2026*
