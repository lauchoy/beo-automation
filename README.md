# BEO Automation Platform

A Next.js 14 TypeScript application for automating Banquet Event Orders (BEOs) with integrated recipe library management, workflow automation, and professional PDF generation.

## ✨ Features

- 📋 **BEO Management**: Create, track, and manage banquet event orders
- 🍽️ **Recipe Library Integration**: Connect to Airtable Fine Dining Recipe Library (Base ID: apprdOlzDhN9YSXJs)
- 📄 **Professional BEO Templates**: Kitchen and Service templates with print-optimized styling
- 🖨️ **PDF Generation**: Convert BEO templates to professional PDFs using Puppeteer
- 🔐 **Secrets Management**: Secure configuration with Doppler
- 🔄 **Workflow Automation**: Automated event planning workflows with agent orchestration
- 📊 **Real-time Updates**: Track event status and progress
- 🎨 **Modern UI**: Built with Tailwind CSS, "Patina" design system, and Lucide icons

## 🔐 Security

**⚠️ IMPORTANT:** Never commit credentials or API keys to version control.

- **[Security Documentation](docs/SECURITY.md)** - Comprehensive security guide
- **[Security Checklist](.github/SECURITY_CHECKLIST.md)** - Quick reference for security tasks
- **[Issue #9](https://github.com/lauchoy/beo-automation/issues/9)** - Active credential rotation tracking

### Quick Security Tips

1. ✅ Always use `.env.local` for local development (never commit it)
2. ✅ Store production secrets in Doppler and deployment platform
3. ✅ Review `.env.example` - it contains only placeholder values
4. ⚠️ Be cautious with `NEXT_PUBLIC_*` variables (exposed to browser)
5. 🔄 Rotate credentials every 90 days or immediately if exposed

## 🆕 New: BEO Templates & PDF Generation

Professional, print-optimized BEO templates based on the banquet-blueprint styling reference:

### Kitchen BEO Template
Focus on back-of-house operations with:
- Menu items with detailed prep instructions and scaling notes
- Priority-based prep schedule with time estimates
- Equipment allocation (cooking, prep, service)
- Kitchen staff assignments and responsibilities
- Visual allergen tracking and legend
- Dietary restrictions summary

### Service BEO Template
Focus on front-of-house operations with:
- Visual service timeline (setup → service → breakdown)
- Staff positioning with table assignments
- Guest management and VIP tracking
- Equipment setup with timing
- Vendor coordination and contacts
- Critical service notes

**[📖 View Quick Start Guide](docs/BEO_QUICK_START.md)** | **[📚 Full Documentation](docs/BEO_TEMPLATES_GUIDE.md)**

## 🚀 Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/lauchoy/beo-automation.git
cd beo-automation

# Install dependencies
npm install

# Configure environment (IMPORTANT: Never commit .env.local!)
cp .env.example .env.local
# Edit .env.local with your REAL credentials
# The .env.example file contains only PLACEHOLDER values

# Start development server
npm run dev
```

### View BEO Templates

- Kitchen BEO: http://localhost:3000/beo/kitchen
- Service BEO: http://localhost:3000/beo/service

### Generate PDF

```bash
# Test PDF generation
npm run test:pdf

# Or via API
curl -X POST http://localhost:3000/api/beo/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"type":"kitchen","data":{...}}' \
  --output beo.pdf
```

## 📚 Documentation

### Core Documentation
- **[BEO Quick Start](docs/BEO_QUICK_START.md)** - Get started in 5 minutes
- **[BEO Templates Guide](docs/BEO_TEMPLATES_GUIDE.md)** - Complete implementation guide
- **[BEO Implementation Summary](docs/BEO_TEMPLATES_IMPLEMENTATION.md)** - Technical details
- **[Agent Orchestration](lib/agents/README.md)** - Agent system documentation
- **[Template README](components/templates/README.md)** - Template usage guide

### Security & Operations
- **[Security Documentation](docs/SECURITY.md)** - 🔐 Credential management & best practices
- **[Security Checklist](.github/SECURITY_CHECKLIST.md)** - Quick reference
- **[Deployment Guide](DEPLOYMENT_FIX_QUICKSTART.md)** - Vercel deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Patina Design System
- **Database**: Airtable
- **PDF Generation**: Puppeteer
- **Secrets**: Doppler SDK
- **Validation**: Zod
- **Icons**: Lucide React
- **Agent Framework**: Custom orchestration layer

## 📂 Project Structure

```
beo-automation/
├── .github/
│   └── SECURITY_CHECKLIST.md # Security quick reference
├── app/
│   ├── api/
│   │   ├── agents/          # Agent orchestration endpoints
│   │   ├── beo/
│   │   │   └── generate-pdf/ # PDF generation API
│   │   ├── beos/            # BEO CRUD endpoints
│   │   ├── recipes/         # Recipe endpoints
│   │   └── workflows/       # Workflow endpoints
│   ├── beo/
│   │   ├── kitchen/         # Kitchen BEO demo page
│   │   └── service/         # Service BEO demo page
│   ├── globals.css          # Global styles
│   ├── beo-print.css        # Print-optimized styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── templates/           # BEO templates (NEW)
│   │   ├── KitchenBEO.tsx
│   │   ├── ServiceBEO.tsx
│   │   ├── sample-data.ts
│   │   └── types.ts
│   ├── BEOList.tsx          # BEO listing
│   ├── RecipeLibrary.tsx    # Recipe browser
│   └── WorkflowManager.tsx  # Workflow management
├── docs/
│   ├── SECURITY.md          # 🔐 Security documentation
│   └── ...                  # Other documentation
├── lib/
│   ├── agents/              # Agent orchestration system
│   ├── pdf-generator.ts     # PDF generation (NEW)
│   ├── airtable-client.ts   # Airtable functions
│   ├── doppler.ts           # Doppler SDK
│   ├── types.ts             # Type definitions
│   └── utils.ts             # Utilities
├── scripts/
│   └── test-pdf-generation.ts # PDF test script (NEW)
├── .env.example             # ⚠️ PLACEHOLDER values only!
├── .gitignore               # Protects .env files
└── package.json
```

## 🎯 Key Components

### BEO Templates (NEW)

**Kitchen BEO** (`components/templates/KitchenBEO.tsx`)
- Menu items with allergens and prep instructions
- Prep schedule with priorities
- Equipment allocation
- Kitchen staff assignments
- Special dietary requirements

**Service BEO** (`components/templates/ServiceBEO.tsx`)
- Service timeline visualization
- Staff positioning and table assignments
- Guest management
- Equipment setup schedule
- Vendor coordination

### BEO Management (`components/BEOList.tsx`)
- Display all banquet event orders
- Filter by status (draft, pending, approved, etc.)
- View event details (date, guests, venue, cost)
- Create new BEOs

### Recipe Library (`components/RecipeLibrary.tsx`)
- Browse recipes from Airtable
- Filter by category
- View recipe details, allergens, and dietary restrictions
- Display prep time, servings, and cost

### Workflow Manager (`components/WorkflowManager.tsx`)
- Create automated workflows for events
- Track workflow steps and dependencies
- Assign tasks to team members
- Monitor progress and completion status

### PDF Generator (NEW) (`lib/pdf-generator.ts`)
- Generate PDFs from React components
- Convert templates to professional documents
- Maintain print-optimized styling
- Support multiple page formats

## 🔌 API Routes

### BEOs
- `GET /api/beos` - List all BEOs
- `GET /api/beos?status=approved` - Filter by status
- `POST /api/beos` - Create new BEO

### Recipes
- `GET /api/recipes` - Fetch from Airtable
- `GET /api/recipes?category=appetizers` - Filter by category

### Workflows
- `GET /api/workflows` - List all workflows
- `GET /api/workflows?beoId=123` - Filter by BEO
- `POST /api/workflows` - Create new workflow

### PDF Generation (NEW)
- `POST /api/beo/generate-pdf` - Generate BEO PDF
- `GET /api/beo/generate-pdf` - API documentation

### Agents
- `GET /api/agents/hello-world` - Agent info and health
- `POST /api/agents/hello-world` - Execute agent
- See [Agent Documentation](lib/agents/README.md) for details

## 🧪 Development & Testing

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Test PDF Generation (NEW)
```bash
npm run test:pdf
```

### Build for Production
```bash
npm run build
npm start
```

## 🔗 Integration

### Airtable
The application connects to the Fine Dining Recipe Library base (`apprdOlzDhN9YSXJs`) to fetch and manage recipes. All Airtable operations are handled through the `lib/airtable-client.ts` module.

### Doppler
Secrets are managed through Doppler. The `lib/doppler.ts` module provides functions to fetch secrets securely. In production, use Doppler's SDK to inject secrets at runtime.

### PDF Generation
Professional PDF output using Puppeteer with the "Patina" design system - monochromatic, minimal, high-fashion editorial styling inspired by museums and Michelin-star hospitality.

## 🎨 Design System: "Patina"

The BEO templates use a sophisticated design system:
- **Typography**: Cormorant Garamond (serif) + Montserrat (sans)
- **Colors**: Pure black & white with subtle gray accents
- **Layout**: Maximal whitespace, ultra-thin 1px borders
- **Style**: Modern museum meets fine dining elegance

## 🚢 Deployment

### Recommended Platforms
- **Vercel**: Optimized for Next.js (automatically handles Puppeteer)
- **Netlify**: Easy deployment with environment variables
- **AWS Amplify**: Enterprise-grade hosting

### Environment Variables for Production

**⚠️ IMPORTANT:** Set these in your deployment platform (Vercel, Netlify, etc.) - **NEVER in code!**

Required variables:
- `AIRTABLE_TOKEN` - 🔴 Server-only (never expose to client)
- `AIRTABLE_BASE_ID` - Can be public (it's in the code)
- `DOPPLER_TOKEN` - 🔴 Server-only (never expose to client)
- `WARP_API_KEY` - 🔴 Server-only (unless client needs it)
- `OZ_ENVIRONMENT_ID` - ⚠️ Depends on usage
- `ENVIRONMENT_ID` - Can be public
- `NEXT_PUBLIC_*` - ⚠️ These are exposed to the browser!

**See [Security Documentation](docs/SECURITY.md) for detailed configuration instructions.**

### Puppeteer in Production

For serverless deployments:
```bash
# Use chrome-aws-lambda for Lambda
npm install chrome-aws-lambda

# Or configure Puppeteer executable path
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

## 📖 Additional Resources

### BEO Templates
- [Quick Start Guide](docs/BEO_QUICK_START.md) - 5-minute setup
- [Implementation Guide](docs/BEO_TEMPLATES_GUIDE.md) - Comprehensive guide
- [Template Documentation](components/templates/README.md) - Usage examples
- [Sample Data](components/templates/sample-data.ts) - Example data structures

### Agent System
- [Agent Documentation](lib/agents/README.md) - Agent orchestration guide
- [Agent Implementation](AGENT_IMPLEMENTATION.md) - Technical details
- [Quick Reference](lib/agents/QUICK_REFERENCE.md) - Quick lookup

### Security & Operations
- [Security Documentation](docs/SECURITY.md) - 🔐 Comprehensive security guide
- [Security Checklist](.github/SECURITY_CHECKLIST.md) - Quick reference
- [Credential Rotation](docs/SECURITY.md#credential-rotation-procedure) - Step-by-step procedures

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. **Review security guidelines** before committing
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

**⚠️ Before submitting a PR:**
- [ ] No credentials or API keys in code
- [ ] All secrets use environment variables
- [ ] `.env.local` is not committed
- [ ] Security documentation reviewed

## 📄 License

Private repository - All rights reserved

## 💬 Support

For questions or issues:
- Open an issue on GitHub
- Check documentation in `/docs` folder
- Review component READMEs
- Contact: Jimmy Lauchoy

**For security issues:** See [Security Documentation](docs/SECURITY.md) for reporting procedures.

## 🎉 Recent Updates

### February 21, 2026 - Security Improvements
- 🔐 Secured `.env.example` with placeholder values
- 📚 Added comprehensive security documentation
- ✅ Created security checklist for quick reference
- 🚨 Created issue #9 for credential rotation tracking

### February 20-21, 2026 - BEO Templates & PDF Generation
- ✅ Added Kitchen BEO template component
- ✅ Added Service BEO template component
- ✅ Implemented Puppeteer-based PDF generation
- ✅ Created PDF generation API endpoint
- ✅ Added sample data and demo pages
- ✅ Included print-optimized styling from banquet-blueprint
- ✅ Comprehensive documentation and guides
- ✅ Testing script for validation

### February 20, 2026 - Agent Orchestration (LAU-377)
- ✅ Complete agent orchestration layer
- ✅ Hello World test agent
- ✅ Production-ready code with logging and metrics
- ✅ API endpoints for agent management

---

**Built with ❤️ for streamlined event management**

**Repository**: https://github.com/lauchoy/beo-automation  
**Version**: 0.1.0  
**Status**: Production Ready ✅  
**Security**: 🔐 Credentials secured & documented
