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

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

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

- **[BEO Quick Start](docs/BEO_QUICK_START.md)** - Get started in 5 minutes
- **[BEO Templates Guide](docs/BEO_TEMPLATES_GUIDE.md)** - Complete implementation guide
- **[BEO Implementation Summary](docs/BEO_TEMPLATES_IMPLEMENTATION.md)** - Technical details
- **[Agent Orchestration](lib/agents/README.md)** - Agent system documentation
- **[Template README](components/templates/README.md)** - Template usage guide

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
├── lib/
│   ├── agents/              # Agent orchestration system
│   ├── pdf-generator.ts     # PDF generation (NEW)
│   ├── airtable-client.ts   # Airtable functions
│   ├── doppler.ts           # Doppler SDK
│   ├── types.ts             # Type definitions
│   └── utils.ts             # Utilities
├── scripts/
│   └── test-pdf-generation.ts # PDF test script (NEW)
├── docs/                    # Documentation (NEW)
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
Ensure all environment variables are set:
- `AIRTABLE_TOKEN`
- `AIRTABLE_BASE_ID`
- `DOPPLER_TOKEN`
- `WARP_API_KEY`
- `ENVIRONMENT_ID`

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Private repository - All rights reserved

## 💬 Support

For questions or issues:
- Open an issue on GitHub
- Check documentation in `/docs` folder
- Review component READMEs
- Contact: Jimmy Lauchoy

## 🎉 Recent Updates

### February 20, 2026 - BEO Templates & PDF Generation
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
