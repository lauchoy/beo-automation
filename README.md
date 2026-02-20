# BEO Automation Platform

A Next.js 14 TypeScript application for automating Banquet Event Orders (BEOs) with integrated recipe library management and workflow automation.

## Features

- 📋 **BEO Management**: Create, track, and manage banquet event orders
- 🍽️ **Recipe Library Integration**: Connect to Airtable Fine Dining Recipe Library (Base ID: apprdOlzDhN9YSXJs)
- 🔐 **Secrets Management**: Secure configuration with Doppler
- 🔄 **Workflow Automation**: Automated event planning workflows
- 📊 **Real-time Updates**: Track event status and progress
- 🎨 **Modern UI**: Built with Tailwind CSS and Lucide icons

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Airtable
- **Secrets**: Doppler SDK
- **Validation**: Zod
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm/yarn
- Airtable account with access to Fine Dining Recipe Library
- Doppler account for secrets management

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/lauchoy/beo-automation.git
cd beo-automation
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:

```env
# Airtable Configuration
AIRTABLE_TOKEN=your_airtable_personal_access_token
AIRTABLE_BASE_ID=apprdOlzDhN9YSXJs

# Doppler Configuration
DOPPLER_TOKEN=your_doppler_service_token
DOPPLER_PROJECT=beo-automation
DOPPLER_CONFIG=dev

# Warp API (optional)
WARP_API_KEY=your_warp_api_key

# Environment
ENVIRONMENT_ID=development
```

### 4. Airtable Setup

1. Get your Airtable Personal Access Token:
   - Go to https://airtable.com/create/tokens
   - Create a new token with `data.records:read` and `data.records:write` scopes
   - Add access to base `apprdOlzDhN9YSXJs` (Fine Dining Recipe Library)

2. Ensure your Airtable base has a table named "Recipes" with these fields:
   - Name (Single line text)
   - Category (Single select)
   - Description (Long text)
   - Ingredients (JSON or Long text)
   - Instructions (Long text)
   - PrepTime (Number)
   - CookTime (Number)
   - Servings (Number)
   - DietaryRestrictions (Multiple select)
   - Allergens (Multiple select)
   - Cost (Currency)

### 5. Doppler Setup

1. Install Doppler CLI (optional):
   ```bash
   # macOS
   brew install dopplerhq/cli/doppler
   
   # Or use Node.js SDK (already included)
   ```

2. Create a Doppler project named `beo-automation`

3. Add secrets to Doppler:
   - `AIRTABLE_TOKEN`
   - `WARP_API_KEY`
   - `environment_id`

4. Generate a service token for the development environment

### 6. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
beo-automation/
├── app/
│   ├── api/              # API routes
│   │   ├── beos/        # BEO endpoints
│   │   ├── recipes/     # Recipe endpoints
│   │   └── workflows/   # Workflow endpoints
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── BEOList.tsx      # BEO listing component
│   ├── RecipeLibrary.tsx # Recipe browser
│   └── WorkflowManager.tsx # Workflow management
├── lib/
│   ├── airtable.ts      # Original Airtable client
│   ├── airtable-client.ts # Enhanced Airtable functions
│   ├── doppler.ts       # Doppler SDK integration
│   ├── types.ts         # TypeScript types & Zod schemas
│   └── utils.ts         # Utility functions
├── .env.example         # Environment template
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies
├── tailwind.config.ts   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Key Components

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

## API Routes

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

## Development

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Build for Production

```bash
npm run build
npm start
```

## Integration Details

### Airtable
The application connects to the Fine Dining Recipe Library base (`apprdOlzDhN9YSXJs`) to fetch and manage recipes. All Airtable operations are handled through the `lib/airtable-client.ts` module.

### Doppler
Secrets are managed through Doppler. The `lib/doppler.ts` module provides functions to fetch secrets securely. In production, use Doppler's SDK to inject secrets at runtime.

## Deployment

Recommended platforms:
- **Vercel**: Optimized for Next.js
- **Netlify**: Easy deployment with environment variables
- **AWS Amplify**: Enterprise-grade hosting

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- `AIRTABLE_TOKEN`
- `AIRTABLE_BASE_ID`
- `DOPPLER_TOKEN`
- `WARP_API_KEY`
- `ENVIRONMENT_ID`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Private repository - All rights reserved

## Support

For questions or issues:
- Open an issue on GitHub
- Contact: [Your contact information]

---

Built with ❤️ for streamlined event management
