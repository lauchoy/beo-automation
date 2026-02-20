# User Documentation

> **Linear Ticket**: LAU-220  
> **Document**: Setup, Usage, and Troubleshooting Guide

## Table of Contents

- [Getting Started](#getting-started)
- [Setup and Configuration](#setup-and-configuration)
- [Creating BEO Documents](#creating-beo-documents)
- [Template System](#template-system)
- [Dashboard Interface](#dashboard-interface)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [FAQ](#faq)

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js v18 or higher** - [Download Node.js](https://nodejs.org/)
- **PostgreSQL v14 or higher** - [Download PostgreSQL](https://www.postgresql.org/download/)
- **npm or yarn** - Package manager (comes with Node.js)
- **Git** - Version control system
- **Airtable Account** (optional) - For Airtable integrations
- **Oz Agent SDK Credentials** (optional) - For automation workflows

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 4 GB | 8+ GB |
| Storage | 10 GB | 20+ GB SSD |
| OS | Windows 10, macOS 10.15, Ubuntu 20.04 | Latest versions |

## Setup and Configuration

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/lauchoy/beo-automation.git

# Navigate to the project directory
cd beo-automation
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

This will install all required packages including:
- Next.js and React dependencies
- PostgreSQL client libraries
- Authentication libraries
- External integration SDKs

### Step 3: Database Setup

#### Option A: Local PostgreSQL Installation

1. **Create a new database**:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE beo_automation;

# Create user (optional)
CREATE USER beo_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE beo_automation TO beo_user;

# Exit psql
\q
```

#### Option B: Cloud Database (Recommended for Production)

You can use cloud PostgreSQL services like:
- **AWS RDS**
- **Google Cloud SQL**
- **Azure Database for PostgreSQL**
- **Heroku Postgres**
- **Supabase**

### Step 4: Environment Configuration

1. **Copy the example environment file**:

```bash
cp .env.example .env
```

2. **Edit `.env` with your configuration**:

```bash
# Application Settings
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=beo_automation
DB_USER=beo_user
DB_PASSWORD=your_secure_password

# Authentication
JWT_SECRET=generate-a-random-secret-key-here
JWT_EXPIRES_IN=7d

# Airtable Integration (Optional)
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id

# Oz Agent SDK (Optional)
OZ_AGENT_API_KEY=your_oz_agent_api_key
OZ_AGENT_ENDPOINT=https://your-oz-endpoint.com
```

**Important Security Notes**:
- Never commit `.env` files to version control
- Use strong, unique passwords for database and JWT secrets
- Rotate API keys regularly
- Use environment-specific configurations

### Step 5: Run Database Migrations

```bash
# Run migrations to create tables
npm run db:migrate

# Seed database with initial data (optional)
npm run db:seed
```

### Step 6: Start the Application

```bash
# Development mode with hot reload
npm run dev

# The application will be available at:
# http://localhost:3000
```

### Step 7: Create Your First User Account

1. Open your browser and navigate to `http://localhost:3000`
2. Click on "Register" or "Sign Up"
3. Fill in your details:
   - Email address
   - Strong password (minimum 8 characters)
   - Full name
4. Click "Create Account"
5. You'll be automatically logged in

### Verification

To verify your installation is successful:

1. **Check the dashboard loads**: Navigate to the dashboard after login
2. **Database connection**: You should see a "Connected" status indicator
3. **API health check**: Visit `http://localhost:3000/api/health`

## Creating BEO Documents

### Understanding BEO Documents

BEO (Backend Engineering Operations) documents are structured records that represent business events, automation workflows, or operational tasks. Each document contains:

- **Metadata**: ID, creation date, owner, status
- **Content**: The actual document data
- **Workflow Information**: Associated automation rules
- **Audit Trail**: History of changes and executions

### Creating a Document: Step-by-Step

#### Method 1: Using the Dashboard UI

1. **Navigate to Documents**:
   - Click "Documents" in the main navigation
   - Click the "+ New Document" button

2. **Select a Template**:
   - Choose from available templates
   - Or select "Blank Document" to start from scratch

3. **Fill in Document Details**:
   ```
   Document Name: [Enter a descriptive name]
   Type: [Select document type]
   Priority: [Low | Normal | High | Urgent]
   ```

4. **Add Content**:
   - Use the rich text editor for content
   - Or switch to "Code View" for advanced editing
   - Add attachments if needed

5. **Configure Automation** (Optional):
   - Enable "Auto-process" toggle
   - Select workflow rules
   - Configure triggers

6. **Save Document**:
   - Click "Save Draft" to save without processing
   - Click "Save & Process" to save and trigger automation

#### Method 2: Using the API

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "document.created",
    "payload": {
      "title": "Q1 Budget Review",
      "content": "Budget analysis content...",
      "metadata": {
        "department": "Finance",
        "fiscal_year": 2026
      }
    },
    "priority": "high"
  }'
```

#### Method 3: Bulk Import

1. **Prepare your data** in CSV or JSON format:

```csv
title,type,priority,content
"Document 1","budget_review","normal","Content here..."
"Document 2","status_report","high","Content here..."
```

2. **Navigate to Import**:
   - Go to Documents > Import
   - Upload your CSV/JSON file
   - Map columns to document fields
   - Click "Import"

3. **Review Import Results**:
   - Check success/failure statistics
   - Review any errors
   - Correct and retry failed imports

### Document Lifecycle

```
[Created] → [Pending] → [Processing] → [Completed]
    │                                    │
    │                                    │
    └────────> [Failed] <──────────────┘
              (with retry)
```

## Template System

### What are Templates?

Templates in BEO Automation are TSX-based (TypeScript + JSX) components that define the structure and layout of documents. They allow you to:

- Create consistent document formats
- Dynamically inject data
- Reuse common document structures
- Apply conditional logic and formatting

### Using Existing Templates

#### View Available Templates

1. Navigate to **Templates** in the sidebar
2. Browse the template library
3. Click on a template to see:
   - Template preview
   - Required fields
   - Sample output
   - Usage examples

#### Apply a Template to a Document

1. When creating a document, select a template
2. Fill in the required fields
3. The template will automatically format your document
4. Preview before saving

### Creating Custom Templates

#### Basic Template Structure

```tsx
// templates/BasicReport.tsx
import React from 'react';

interface BasicReportProps {
  title: string;
  author: string;
  content: string;
  date: string;
}

export const BasicReport: React.FC<BasicReportProps> = ({
  title,
  author,
  content,
  date,
}) => {
  return (
    <div className="document">
      <header>
        <h1>{title}</h1>
        <p className="metadata">
          <span>By: {author}</span>
          <span>Date: {new Date(date).toLocaleDateString()}</span>
        </p>
      </header>
      
      <main>
        <div className="content">
          {content}
        </div>
      </main>
      
      <footer>
        <p>Generated by BEO Automation</p>
      </footer>
    </div>
  );
};
```

#### Creating a Template via UI

1. **Navigate to Templates > Create New**

2. **Enter Template Information**:
   ```
   Name: Monthly Status Report
   Description: Standard monthly team status report
   Version: 1.0.0
   ```

3. **Define Data Schema**:
   ```json
   {
     "type": "object",
     "required": ["month", "team", "summary"],
     "properties": {
       "month": {
         "type": "string",
         "description": "Reporting month"
       },
       "team": {
         "type": "string",
         "description": "Team name"
       },
       "summary": {
         "type": "string",
         "description": "Executive summary"
       }
     }
   }
   ```

4. **Write Template Code**:
   - Use the built-in code editor
   - Leverage syntax highlighting
   - Test with sample data

5. **Preview and Test**:
   - Use the preview panel
   - Test with different data sets
   - Check responsive design

6. **Publish Template**:
   - Click "Publish"
   - Template becomes available to all users
   - Version is tracked automatically

### Advanced Template Features

#### Conditional Rendering

```tsx
export const ConditionalTemplate: React.FC<Props> = ({ status, data }) => {
  return (
    <div>
      {status === 'approved' && (
        <div className="approved-badge">Approved</div>
      )}
      
      {data.items.length > 0 ? (
        <ul>
          {data.items.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      ) : (
        <p>No items to display</p>
      )}
    </div>
  );
};
```

#### Using Components

```tsx
import { Header, Footer, DataTable } from '../components';

export const ComplexTemplate: React.FC<Props> = ({ data }) => {
  return (
    <div>
      <Header title={data.title} />
      <DataTable rows={data.rows} columns={data.columns} />
      <Footer />
    </div>
  );
};
```

#### Styling Templates

```tsx
export const StyledTemplate: React.FC<Props> = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {data.title}
      </h1>
      <div className="prose prose-lg">
        {data.content}
      </div>
    </div>
  );
};
```

## Dashboard Interface

### Dashboard Overview

The BEO Automation dashboard provides a centralized view of all your operations:

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  BEO Automation Dashboard                                                   │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐       │
│  │ Active Events  │  │  Processing     │  │  Completed      │       │
│  │      142       │  │       23       │  │      1,234     │       │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘       │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │  Recent Events                                                 │       │
│  ├─────────────────────────────────────────────────────────────────┤       │
│  │ ID        | Type              | Status       | Time         │       │
│  ├─────────────────────────────────────────────────────────────────┤       │
│  │ evt-1234  | document.created  | Completed    | 2 min ago    │       │
│  │ evt-1235  | workflow.execute  | Processing   | 5 min ago    │       │
│  │ evt-1236  | data.sync         | Completed    | 10 min ago   │       │
│  └─────────────────────────────────────────────────────────────────┘       │
└────────────────────────────────────────────────────────────────────────────────┘
```

### Key Dashboard Sections

#### 1. Statistics Cards

- **Active Events**: Currently pending or processing events
- **Processing**: Events currently being processed
- **Completed Today**: Successfully processed events in the last 24 hours
- **Failed**: Events that encountered errors

#### 2. Recent Events Table

Displays the most recent events with:
- Event ID (clickable for details)
- Event type
- Current status
- Timestamp
- Quick actions (retry, view details, delete)

#### 3. Workflow Monitor

Shows active workflows:
- Workflow name
- Current step
- Progress percentage
- Estimated completion time

#### 4. System Health

- Database connection status
- API response time
- External integration status (Airtable, Oz Agent)
- Error rate

### Filtering and Search

#### Using Filters

1. Click the "Filter" button
2. Select filter criteria:
   - **Status**: All, Pending, Processing, Completed, Failed
   - **Type**: Document, Workflow, Data Sync, etc.
   - **Date Range**: Today, Last 7 days, Last 30 days, Custom
   - **Priority**: All, Low, Normal, High, Urgent
3. Click "Apply Filters"

#### Search Functionality

```
[Search: document budget 2026]
  → Searches across:
     - Event IDs
     - Event types
     - Payload content
     - Associated users
```

### Real-time Updates

The dashboard automatically refreshes:
- Every 5 seconds for active events
- Real-time for status changes
- Push notifications for critical events

## Troubleshooting

### Common Issues and Solutions

#### Database Connection Issues

**Problem**: "Cannot connect to database" error

**Solutions**:

1. **Check PostgreSQL is running**:
   ```bash
   # On macOS/Linux
   sudo systemctl status postgresql
   
   # On Windows
   # Check Services app for PostgreSQL service
   ```

2. **Verify connection details**:
   ```bash
   # Test connection
   psql -h localhost -U beo_user -d beo_automation
   ```

3. **Check .env configuration**:
   ```bash
   DB_HOST=localhost  # Should match your PostgreSQL host
   DB_PORT=5432       # Default PostgreSQL port
   DB_NAME=beo_automation
   DB_USER=your_user
   DB_PASSWORD=your_password
   ```

4. **Check firewall settings**:
   - Ensure port 5432 is not blocked
   - Allow connections from your application

#### Authentication Issues

**Problem**: "Invalid token" or "Unauthorized" errors

**Solutions**:

1. **Clear browser cache and cookies**
2. **Re-login** to get a fresh token
3. **Check JWT secret** in .env matches server configuration
4. **Verify token hasn't expired**:
   ```javascript
   // In browser console
   const token = localStorage.getItem('authToken');
   const decoded = JSON.parse(atob(token.split('.')[1]));
   console.log(new Date(decoded.exp * 1000)); // Token expiry
   ```

#### Integration Issues

**Problem**: Airtable sync failing

**Solutions**:

1. **Verify API key is valid**:
   - Log into Airtable
   - Go to Account > API
   - Generate new key if needed

2. **Check base ID is correct**:
   ```bash
   # Base ID format: appXXXXXXXXXXXXXX
   # Find it in your Airtable URL
   ```

3. **Verify permissions**:
   - Ensure API key has access to the base
   - Check table permissions

4. **Test connection**:
   ```bash
   curl -X GET https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

**Problem**: Oz Agent SDK not responding

**Solutions**:

1. **Check SDK endpoint**:
   ```bash
   curl -X GET $OZ_AGENT_ENDPOINT/health
   ```

2. **Verify API credentials**
3. **Check network connectivity**
4. **Review SDK logs** for errors

#### Template Rendering Issues

**Problem**: Template not rendering correctly

**Solutions**:

1. **Check for syntax errors**:
   - Validate TSX syntax
   - Check for missing closing tags
   - Verify prop types match

2. **Verify data schema**:
   ```typescript
   // Ensure data matches expected structure
   console.log(JSON.stringify(templateData, null, 2));
   ```

3. **Check for missing dependencies**:
   - Ensure all imported components exist
   - Verify CSS classes are defined

4. **Test with sample data**:
   - Use template preview with known-good data
   - Isolate the issue by removing sections

### Performance Issues

**Problem**: Slow dashboard loading

**Solutions**:

1. **Reduce pagination size**:
   - Lower items per page
   - Implement lazy loading

2. **Optimize database queries**:
   - Add indexes to frequently queried columns
   - Use database query analyzer

3. **Clear old events**:
   ```sql
   -- Archive old completed events
   DELETE FROM events 
   WHERE status = 'completed' 
   AND created_at < NOW() - INTERVAL '90 days';
   ```

4. **Check server resources**:
   - Monitor CPU and memory usage
   - Scale up if consistently high

### Error Messages Reference

| Error Code | Message | Cause | Solution |
|------------|---------|-------|----------|
| `AUTH_001` | Invalid credentials | Wrong email/password | Check credentials |
| `AUTH_002` | Token expired | JWT token expired | Re-login |
| `DB_001` | Connection failed | Database unreachable | Check DB connection |
| `DB_002` | Query timeout | Slow query | Optimize query/add index |
| `API_001` | Rate limit exceeded | Too many requests | Wait and retry |
| `INT_001` | Airtable sync failed | API key or permissions | Verify Airtable config |
| `INT_002` | Oz Agent error | SDK connection issue | Check SDK configuration |
| `TPL_001` | Template render error | Invalid template | Fix template syntax |

## Best Practices

### Event Management

1. **Use Descriptive Event Types**
   ```javascript
   // Good
   type: "invoice.payment.received"
   
   // Bad
   type: "event1"
   ```

2. **Include Sufficient Context in Payload**
   ```json
   {
     "type": "document.created",
     "payload": {
       "documentId": "doc-123",
       "userId": "user-456",
       "documentType": "invoice",
       "metadata": {
         "department": "sales",
         "priority": "high"
       }
     }
   }
   ```

3. **Set Appropriate Priorities**
   - `urgent`: Critical business operations
   - `high`: Important but not critical
   - `normal`: Standard operations
   - `low`: Background tasks

### Template Management

1. **Version Your Templates**
   - Use semantic versioning (1.0.0, 1.1.0, 2.0.0)
   - Document breaking changes
   - Maintain backwards compatibility when possible

2. **Validate Input Data**
   ```typescript
   export const SafeTemplate: React.FC<Props> = ({ data }) => {
     // Validate required fields
     if (!data.title || !data.content) {
       return <ErrorMessage>Missing required fields</ErrorMessage>;
     }
     
     return <div>{/* template content */}</div>;
   };
   ```

3. **Use TypeScript for Type Safety**
   ```typescript
   interface TemplateProps {
     title: string;
     content: string;
     author?: string;  // Optional field
     tags: string[];   // Array type
   }
   ```

### Automation Rules

1. **Test Before Enabling**
   - Use test mode for new workflows
   - Verify with sample data
   - Monitor first few executions

2. **Implement Error Handling**
   - Define retry strategies
   - Set up failure notifications
   - Log errors for debugging

3. **Monitor Performance**
   - Track execution times
   - Set timeout limits
   - Optimize slow workflows

### Security

1. **Rotate API Keys Regularly**
   - Schedule quarterly rotations
   - Use environment-specific keys
   - Revoke unused keys

2. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of upper/lower case, numbers, symbols
   - Use password manager

3. **Limit Access**
   - Use role-based access control
   - Grant minimum necessary permissions
   - Regularly audit user access

## FAQ

### General Questions

**Q: How many events can BEO Automation handle?**

A: BEO Automation can process thousands of events per hour, depending on complexity. For high-volume scenarios (>10,000 events/hour), consider scaling horizontally.

**Q: Can I use BEO Automation offline?**

A: No, BEO Automation requires internet connectivity for external integrations (Airtable, Oz Agent SDK). However, core functionality works without these integrations.

**Q: Is my data encrypted?**

A: Yes, data is encrypted:
- In transit: TLS 1.3
- At rest: PostgreSQL native encryption
- Passwords: bcrypt hashing

### Technical Questions

**Q: Can I add custom integrations?**

A: Yes! BEO Automation supports custom integrations. See the Development Guide for creating integration plugins.

**Q: What's the maximum file size for uploads?**

A: Default limit is 10MB. This can be configured in the environment variables.

**Q: Can I export my data?**

A: Yes, you can export:
- Events to CSV/JSON
- Templates as TSX files
- Database backups via pg_dump

### Billing and Licensing

**Q: Is BEO Automation free?**

A: BEO Automation is proprietary software. Contact your administrator for licensing details.

**Q: Are there usage limits?**

A: Limits depend on your deployment:
- Self-hosted: No limits (hardware dependent)
- Cloud-hosted: Per your service plan

---

**Navigation**:  
[← Back to Technical Documentation](./02-technical-documentation.md) | [Next: Development Guide →](./04-development-guide.md)