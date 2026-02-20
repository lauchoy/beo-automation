# Development Guide

> **Linear Ticket**: LAU-220  
> **Document**: Developer Onboarding and Contribution Guide

## Table of Contents

- [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Git Workflow](#git-workflow)
- [Code Style Guide](#code-style-guide)
- [Contribution Guidelines](#contribution-guidelines)
- [Building for Production](#building-for-production)

## Local Development Setup

### Prerequisites Installation

#### 1. Install Node.js

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or download from nodejs.org
# Verify installation
node --version  # Should be v18.x.x or higher
npm --version   # Should be 9.x.x or higher
```

#### 2. Install PostgreSQL

**macOS** (using Homebrew):
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian**:
```bash
sudo apt update
sudo apt install postgresql-14 postgresql-contrib
sudo systemctl start postgresql
```

**Windows**:
- Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Run installer and follow prompts

#### 3. Install Git

```bash
# macOS
brew install git

# Ubuntu/Debian
sudo apt install git

# Windows
# Download from git-scm.com
```

### Setting Up the Development Environment

#### Step 1: Fork and Clone

```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR-USERNAME/beo-automation.git
cd beo-automation

# Add upstream remote
git remote add upstream https://github.com/lauchoy/beo-automation.git
```

#### Step 2: Install Dependencies

```bash
# Install all dependencies
npm install

# If you encounter permission errors on macOS/Linux:
sudo chown -R $(whoami) ~/.npm
npm install
```

#### Step 3: Configure Development Environment

```bash
# Copy environment template
cp .env.example .env.development

# Edit .env.development
# Set the following for local development:
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=beo_automation_dev
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=$(openssl rand -base64 32)
```

#### Step 4: Setup Development Database

```bash
# Create development database
createdb beo_automation_dev

# Run migrations
npm run db:migrate:dev

# Seed with test data (optional)
npm run db:seed:dev
```

#### Step 5: Start Development Server

```bash
# Start the development server with hot reload
npm run dev

# Server will be available at:
# http://localhost:3000
```

#### Step 6: Verify Installation

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health
- **API Docs**: http://localhost:3000/api/docs (if enabled)

### Development Tools

#### Recommended VS Code Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "firsttris.vscode-jest-runner",
    "GitHub.copilot"
  ]
}
```

#### VS Code Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Project Structure

```
beo-automation/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/             # Authentication endpoints
│   │   ├── events/           # Event management endpoints
│   │   ├── templates/        # Template endpoints
│   │   └── workflows/        # Workflow endpoints
│   ├── dashboard/            # Dashboard pages
│   ├── documents/            # Document management pages
│   ├── templates/            # Template management pages
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
│
├── components/               # React components
│   ├── ui/                   # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── dashboard/            # Dashboard-specific components
│   ├── templates/            # Template components
│   └── workflows/            # Workflow components
│
├── lib/                      # Core library code
│   ├── db/                   # Database layer
│   │   ├── index.ts          # Database connection
│   │   ├── migrations/       # Database migrations
│   │   ├── repositories/     # Data access layer
│   │   └── seeds/            # Seed data
│   ├── services/             # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── event.service.ts
│   │   ├── template.service.ts
│   │   └── workflow.service.ts
│   ├── integrations/         # External integrations
│   │   ├── airtable.ts
│   │   └── oz-agent.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logging.middleware.ts
│   ├── utils/                # Utility functions
│   │   ├── validation.ts
│   │   ├── helpers.ts
│   │   └── logger.ts
│   └── types/                # TypeScript types
│       ├── event.types.ts
│       ├── template.types.ts
│       └── workflow.types.ts
│
├── public/                   # Static assets
│   ├── images/
│   ├── fonts/
│   └── icons/
│
├── tests/                    # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   ├── e2e/                  # End-to-end tests
│   └── fixtures/             # Test fixtures
│
├── docs/                     # Documentation
│   ├── README.md
│   ├── 01-project-overview.md
│   ├── 02-technical-documentation.md
│   ├── 03-user-documentation.md
│   ├── 04-development-guide.md
│   └── 05-maintenance-guide.md
│
├── .env.example              # Environment template
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore rules
├── .prettierrc               # Prettier configuration
├── jest.config.js            # Jest configuration
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project README
```

### Key Directories Explained

#### `/app` - Next.js Application
Contains all frontend pages and API routes using Next.js 14 App Router.

#### `/components` - React Components
Reusable React components organized by feature. Follow atomic design principles.

#### `/lib` - Core Business Logic
- **`/db`**: Database connection, repositories, migrations
- **`/services`**: Business logic services (thin controllers, fat services)
- **`/integrations`**: External service integrations
- **`/middleware`**: Express/Next.js middleware
- **`/utils`**: Helper functions and utilities
- **`/types`**: TypeScript type definitions

#### `/tests` - Test Suite
Organized by test type: unit, integration, and end-to-end.

## Testing

### Test Strategy

BEO Automation uses a three-tier testing approach:

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test service interactions and API endpoints
3. **End-to-End Tests**: Test complete user workflows

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- event.service.test.ts

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only e2e tests
npm run test:e2e
```

### Writing Unit Tests

#### Testing a Service

```typescript
// tests/unit/services/event.service.test.ts
import { EventService } from '@/lib/services/event.service';
import { EventRepository } from '@/lib/db/repositories/event.repository';

jest.mock('@/lib/db/repositories/event.repository');

describe('EventService', () => {
  let eventService: EventService;
  let eventRepository: jest.Mocked<EventRepository>;

  beforeEach(() => {
    eventRepository = new EventRepository() as jest.Mocked<EventRepository>;
    eventService = new EventService(eventRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      // Arrange
      const eventData = {
        type: 'document.created',
        payload: { documentId: 'doc-123' },
        priority: 'normal' as const,
      };

      const mockEvent = {
        id: 'event-123',
        ...eventData,
        status: 'pending',
        createdAt: new Date(),
      };

      eventRepository.create.mockResolvedValue(mockEvent);

      // Act
      const result = await eventService.createEvent(eventData);

      // Assert
      expect(result).toEqual(mockEvent);
      expect(eventRepository.create).toHaveBeenCalledWith(eventData);
    });

    it('should throw error for invalid event type', async () => {
      // Arrange
      const invalidEventData = {
        type: '',
        payload: {},
        priority: 'normal' as const,
      };

      // Act & Assert
      await expect(
        eventService.createEvent(invalidEventData)
      ).rejects.toThrow('Invalid event type');
    });
  });
});
```

#### Testing a React Component

```typescript
// tests/unit/components/EventCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { EventCard } from '@/components/dashboard/EventCard';

describe('EventCard', () => {
  const mockEvent = {
    id: 'event-123',
    type: 'document.created',
    status: 'completed',
    createdAt: new Date('2026-02-19'),
  };

  it('should render event details', () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText('event-123')).toBeInTheDocument();
    expect(screen.getByText('document.created')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<EventCard event={mockEvent} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledWith('event-123');
  });
});
```

### Writing Integration Tests

```typescript
// tests/integration/api/events.test.ts
import request from 'supertest';
import { app } from '@/app';
import { setupTestDatabase, teardownTestDatabase } from '@/tests/helpers';

describe('Events API', () => {
  let authToken: string;

  beforeAll(async () => {
    await setupTestDatabase();
    // Get auth token for authenticated requests
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    authToken = response.body.data.token;
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'test.event',
          payload: { test: 'data' },
          priority: 'normal',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.type).toBe('test.event');
    });

    it('should return 400 for invalid event data', async () => {
      const response = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ type: '' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/events')
        .send({ type: 'test.event' });

      expect(response.status).toBe(401);
    });
  });
});
```

### Writing E2E Tests

```typescript
// tests/e2e/event-creation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Event Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should create event from dashboard', async ({ page }) => {
    // Navigate to events
    await page.click('a[href="/events"]');
    
    // Click create button
    await page.click('button:has-text("New Event")');
    
    // Fill form
    await page.fill('input[name="type"]', 'test.event');
    await page.fill('textarea[name="payload"]', '{"test": "data"}');
    await page.selectOption('select[name="priority"]', 'high');
    
    // Submit
    await page.click('button:has-text("Create Event")');
    
    // Verify success
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('.event-card')).toContainText('test.event');
  });
});
```

### Test Coverage Goals

- **Overall**: Minimum 80% coverage
- **Services**: Minimum 90% coverage
- **API Routes**: Minimum 85% coverage
- **Components**: Minimum 75% coverage

## Git Workflow

### Branch Naming Convention

Follow this pattern for all branches:

```
<username>/lau-<ticket-number>-<short-description>
```

**Examples**:
```bash
git checkout -b lauchoy/lau-220-comprehensive-documentation
git checkout -b lauchoy/lau-221-add-event-filtering
git checkout -b lauchoy/lau-222-fix-authentication-bug
```

**Branch Types**:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
git commit -m "feat(events): add event filtering by date range"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs: update API reference for events endpoint"
git commit -m "refactor(services): simplify event processing logic"
```

### Pull Request Workflow

#### 1. Create Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b lauchoy/lau-XXX-feature-name
```

#### 2. Make Changes and Commit

```bash
# Make your changes

# Stage changes
git add .

# Commit with conventional commit message
git commit -m "feat(scope): description"
```

#### 3. Keep Branch Updated

```bash
# Regularly sync with main
git fetch upstream
git rebase upstream/main
```

#### 4. Push to Your Fork

```bash
git push origin lauchoy/lau-XXX-feature-name
```

#### 5. Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in PR template:
   ```markdown
   ## Description
   Brief description of changes

   ## Linear Ticket
   LAU-XXX

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests added/updated
   - [ ] Integration tests added/updated
   - [ ] E2E tests added/updated
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex logic
   - [ ] Documentation updated
   - [ ] No new warnings generated
   - [ ] Tests pass locally
   ```

#### 6. Code Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Peer Review**: At least one approval required
3. **Address Feedback**: Make requested changes
4. **Final Approval**: Maintainer approves
5. **Merge**: Squash and merge to main

### Git Best Practices

1. **Commit Often**: Make small, logical commits
2. **Write Clear Messages**: Descriptive commit messages
3. **Test Before Committing**: Run tests locally
4. **Keep PRs Small**: Easier to review (max 400 lines)
5. **Rebase, Don't Merge**: Keep history clean
6. **Delete Merged Branches**: Clean up after merge

## Code Style Guide

### TypeScript/JavaScript

#### Naming Conventions

```typescript
// ✅ Good
const userCount = 10;                    // camelCase for variables
const MAX_RETRIES = 3;                   // UPPER_SNAKE_CASE for constants
function calculateTotal() {}             // camelCase for functions
class EventProcessor {}                  // PascalCase for classes
interface UserData {}                    // PascalCase for interfaces
type EventStatus = 'pending' | 'done';   // PascalCase for types

// ❌ Bad
const user_count = 10;
function CalculateTotal() {}
class eventProcessor {}
```

#### Code Organization

```typescript
// ✅ Good: Organize imports
import { useState, useEffect } from 'react';        // React imports first
import { useRouter } from 'next/navigation';       // Next.js imports
import { EventService } from '@/lib/services';     // Internal imports
import { formatDate } from '@/lib/utils';          // Utility imports
import type { Event } from '@/lib/types';          // Type imports

// ✅ Good: Use explicit types
function processEvent(event: Event): Promise<void> {
  // Implementation
}

// ❌ Bad: Implicit any
function processEvent(event) {
  // Implementation
}
```

#### Error Handling

```typescript
// ✅ Good: Specific error handling
try {
  const result = await eventService.create(data);
  return result;
} catch (error) {
  if (error instanceof ValidationError) {
    throw new BadRequestError(error.message);
  }
  if (error instanceof DatabaseError) {
    logger.error('Database error:', error);
    throw new InternalServerError('Failed to create event');
  }
  throw error;
}

// ❌ Bad: Generic error handling
try {
  const result = await eventService.create(data);
  return result;
} catch (error) {
  console.log(error);
  throw new Error('Something went wrong');
}
```

#### Async/Await

```typescript
// ✅ Good: Use async/await
async function fetchEvents(): Promise<Event[]> {
  const events = await eventRepository.findAll();
  return events;
}

// ❌ Bad: Promise chains
function fetchEvents(): Promise<Event[]> {
  return eventRepository.findAll().then(events => events);
}
```

### React Components

```typescript
// ✅ Good: Functional component with TypeScript
import { FC } from 'react';

interface EventCardProps {
  event: Event;
  onSelect?: (id: string) => void;
}

export const EventCard: FC<EventCardProps> = ({ event, onSelect }) => {
  const handleClick = () => {
    onSelect?.(event.id);
  };

  return (
    <div className="event-card" onClick={handleClick}>
      <h3>{event.type}</h3>
      <p>{event.status}</p>
    </div>
  );
};

// ❌ Bad: Class component without types
export class EventCard extends React.Component {
  render() {
    return <div>{this.props.event.type}</div>;
  }
}
```

### File Organization

```typescript
// File: event.service.ts

// 1. Imports
import { EventRepository } from '../repositories';
import type { Event, CreateEventDTO } from '../types';

// 2. Types/Interfaces
interface EventServiceOptions {
  maxRetries: number;
}

// 3. Class/Function
export class EventService {
  constructor(
    private eventRepository: EventRepository,
    private options: EventServiceOptions
  ) {}

  // 4. Public methods first
  async createEvent(data: CreateEventDTO): Promise<Event> {
    return this.eventRepository.create(data);
  }

  // 5. Private methods last
  private async validateEvent(event: Event): Promise<boolean> {
    // Implementation
    return true;
  }
}
```

### Comments

```typescript
// ✅ Good: Comments explain "why", not "what"
// Retry failed events up to 3 times to handle transient errors
const MAX_RETRIES = 3;

// Use exponential backoff to avoid overwhelming the service
const delay = Math.pow(2, retryCount) * 1000;

// ❌ Bad: Comments state the obvious
// Set MAX_RETRIES to 3
const MAX_RETRIES = 3;

// Multiply 2 by retryCount and then by 1000
const delay = Math.pow(2, retryCount) * 1000;
```

## Contribution Guidelines

### Before Contributing

1. **Check Existing Issues**: Search for similar issues/features
2. **Discuss Major Changes**: Open an issue for discussion first
3. **Read Documentation**: Familiarize yourself with the codebase
4. **Setup Development Environment**: Follow setup guide

### Making Contributions

1. **Fork Repository**: Create your own fork
2. **Create Branch**: Follow naming conventions
3. **Make Changes**: Follow code style guide
4. **Write Tests**: Maintain test coverage
5. **Update Documentation**: Keep docs in sync
6. **Submit PR**: Use PR template

### Code Review Guidelines

#### For Authors

- **Self-review** before requesting review
- **Respond promptly** to feedback
- **Be open** to suggestions
- **Test thoroughly** before requesting review

#### For Reviewers

- **Be constructive** in feedback
- **Explain reasoning** behind suggestions
- **Approve quickly** if changes are good
- **Request changes** if issues found

### What We Look For

- ✅ Clean, readable code
- ✅ Proper error handling
- ✅ Comprehensive tests
- ✅ Updated documentation
- ✅ No breaking changes (or properly documented)
- ✅ Performance considerations
- ✅ Security best practices

## Building for Production

### Production Build

```bash
# Build the application
npm run build

# This will:
# 1. Compile TypeScript
# 2. Bundle Next.js application
# 3. Optimize assets
# 4. Generate static pages
```

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Documentation updated
- [ ] Performance tested
- [ ] Security audit completed

### Running Production Build Locally

```bash
# Build
npm run build

# Start production server
NODE_ENV=production npm start
```

---

**Navigation**:  
[← Back to User Documentation](./03-user-documentation.md) | [Next: Maintenance Guide →](./05-maintenance-guide.md)