# Technical Documentation

> **Linear Ticket**: LAU-220  
> **Document**: Technical Architecture and API Reference

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Data Flow](#data-flow)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Integration Documentation](#integration-documentation)
- [Deployment](#deployment)
- [Configuration](#configuration)

## Architecture Overview

### System Components

BEO Automation follows a three-tier architecture pattern:

```
┌─────────────────────────────────────────────────────────┐
│                   Presentation Tier                          │
│                                                               │
│   ┌─────────────────────────────────────────────┐   │
│   │           Next.js Application                     │   │
│   │   - React Components                            │   │
│   │   - Client-side Routing                         │   │
│   │   - State Management                            │   │
│   │   - API Client                                  │   │
│   └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         │
                         │ REST API (HTTPS)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Application Tier                          │
│                                                               │
│   ┌─────────────────────────────────────────────┐   │
│   │          Node.js Backend                       │   │
│   │                                                  │   │
│   │   ┌────────────────────────────────────┐   │   │
│   │   │     REST API Routes              │   │   │
│   │   └────────────────────────────────────┘   │   │
│   │   ┌────────────────────────────────────┐   │   │
│   │   │     Business Logic Layer        │   │   │
│   │   │   - Event Processing           │   │   │
│   │   │   - Workflow Execution         │   │   │
│   │   │   - Template Engine            │   │   │
│   │   └────────────────────────────────────┘   │   │
│   │   ┌────────────────────────────────────┐   │   │
│   │   │     Data Access Layer           │   │   │
│   │   │   - Database Queries           │   │   │
│   │   │   - External API Calls         │   │   │
│   │   └────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         │
                         │ SQL / Connection Pool
                         ▼
┌─────────────────────────────────────────────────────────┐
│                      Data Tier                              │
│                                                               │
│   ┌─────────────────────────────────────────────┐   │
│   │         PostgreSQL Database                   │   │
│   │   - Relational Tables                       │   │
│   │   - Indexes                                 │   │
│   │   - Constraints                             │   │
│   │   - Views                                   │   │
│   └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Design Patterns

BEO Automation implements several key design patterns:

#### 1. **Repository Pattern**
- Abstracts data access logic
- Provides clean separation between business logic and data layer
- Enables easier testing with mock repositories

#### 2. **Service Layer Pattern**
- Encapsulates business logic
- Provides reusable service methods
- Coordinates between multiple repositories

#### 3. **Middleware Pattern**
- Authentication middleware for JWT validation
- Error handling middleware for consistent error responses
- Logging middleware for request/response tracking

#### 4. **Strategy Pattern**
- Different integration strategies (Airtable, Oz Agent)
- Pluggable authentication strategies
- Configurable event processing strategies

## Data Flow

### Event Processing Data Flow

```
1. Event Source
     │
     │ (HTTP POST)
     ▼
2. API Gateway
     │
     │ (Validate Request)
     ▼
3. Authentication Middleware
     │
     │ (Verify JWT)
     ▼
4. Event Controller
     │
     │ (Parse & Validate)
     ▼
5. Event Service
     │
     │ (Business Logic)
     ▼
6. Event Repository
     │
     │ (Save to DB)
     ▼
7. PostgreSQL Database
     │
     │ (Persist)
     ▼
8. Workflow Executor
     │
     ├─────────────────────────────────> Airtable API
     │                                  (Sync Data)
     │
     └─────────────────────────────────> Oz Agent SDK
                                   (Execute Workflow)
     │
     │ (Update Status)
     ▼
9. Database Update
     │
     │ (Return Result)
     ▼
10. API Response
     │
     │ (JSON)
     ▼
11. Frontend Update
     (UI Refresh)
```

### Authentication Flow

```
1. User Login Request
     │
     │ POST /api/auth/login
     ▼
2. Auth Controller
     │
     │ (Validate Credentials)
     ▼
3. User Repository
     │
     │ (Query Database)
     ▼
4. Password Verification
     │
     │ (bcrypt compare)
     ▼
5. JWT Generation
     │
     │ (Sign Token)
     ▼
6. Return Token
     │
     │ (Response)
     ▼
7. Client Storage
     │
     │ (localStorage/Cookie)
     ▼
8. Subsequent Requests
     (Include JWT in Authorization header)
```

## API Reference

### Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

### Authentication

All API requests (except login/register) require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <token>
```

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2026-02-19T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Email already exists

#### POST /api/auth/login

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing credentials
- `401 Unauthorized` - Invalid credentials

#### GET /api/auth/me

Get current authenticated user details.

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2026-02-19T00:00:00Z"
  }
}
```

### Event Endpoints

#### GET /api/events

Retrieve list of events with pagination and filtering.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `status` (string) - Filter by status: `pending`, `processing`, `completed`, `failed`
- `type` (string) - Filter by event type
- `startDate` (ISO 8601) - Filter events after this date
- `endDate` (ISO 8601) - Filter events before this date

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "uuid",
        "type": "document.created",
        "status": "completed",
        "payload": {},
        "createdAt": "2026-02-19T00:00:00Z",
        "updatedAt": "2026-02-19T00:01:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

#### POST /api/events

Create a new event for processing.

**Request Body:**
```json
{
  "type": "document.created",
  "payload": {
    "documentId": "doc-123",
    "userId": "user-456",
    "metadata": {}
  },
  "priority": "normal"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "document.created",
    "status": "pending",
    "payload": {},
    "priority": "normal",
    "createdAt": "2026-02-19T00:00:00Z"
  }
}
```

#### GET /api/events/:id

Get details of a specific event.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "document.created",
    "status": "completed",
    "payload": {},
    "executionHistory": [
      {
        "timestamp": "2026-02-19T00:00:00Z",
        "status": "pending",
        "message": "Event created"
      },
      {
        "timestamp": "2026-02-19T00:00:30Z",
        "status": "processing",
        "message": "Started processing"
      },
      {
        "timestamp": "2026-02-19T00:01:00Z",
        "status": "completed",
        "message": "Successfully processed"
      }
    ],
    "createdAt": "2026-02-19T00:00:00Z",
    "updatedAt": "2026-02-19T00:01:00Z"
  }
}
```

### Template Endpoints

#### GET /api/templates

List all available templates.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Standard Document",
      "description": "Standard document template",
      "version": "1.0.0",
      "createdAt": "2026-02-19T00:00:00Z"
    }
  ]
}
```

#### POST /api/templates

Create a new template.

**Request Body:**
```json
{
  "name": "New Template",
  "description": "Description of the template",
  "content": "<TSX template content>",
  "schema": {
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "content": { "type": "string" }
    }
  }
}
```

**Response:** `201 Created`

#### POST /api/templates/:id/render

Render a template with data.

**Request Body:**
```json
{
  "data": {
    "title": "My Document",
    "content": "Document content here"
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "rendered": "<rendered HTML content>"
  }
}
```

### Workflow Endpoints

#### GET /api/workflows

List all workflows.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Document Processing Workflow",
      "status": "active",
      "trigger": "event",
      "steps": [],
      "createdAt": "2026-02-19T00:00:00Z"
    }
  ]
}
```

#### POST /api/workflows/:id/execute

Manually execute a workflow.

**Request Body:**
```json
{
  "input": {
    "eventId": "event-uuid"
  }
}
```

**Response:** `202 Accepted`
```json
{
  "success": true,
  "data": {
    "executionId": "exec-uuid",
    "status": "running"
  }
}
```

### Integration Endpoints

#### POST /api/integrations/airtable/sync

Trigger Airtable data synchronization.

**Request Body:**
```json
{
  "baseId": "appXXXXXXXXXXXXXX",
  "tableId": "tblXXXXXXXXXXXXXX",
  "direction": "bidirectional"
}
```

**Response:** `202 Accepted`

#### GET /api/integrations/oz-agent/status

Check Oz Agent SDK connection status.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "connected": true,
    "agentCount": 5,
    "activeWorkflows": 12
  }
}
```

### Error Responses

All error responses follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

**Common HTTP Status Codes:**
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Database Schema

### Entity Relationship Diagram

```
┌──────────────────────┐
│       users          │
│──────────────────────│
│ id (PK)            │
│ email              │
│ password_hash      │
│ name               │
│ role               │
│ created_at         │
│ updated_at         │
└──────────────────────┘
        │
        │ 1
        │
        │ M
        ▼
┌──────────────────────┐
│       events         │
│──────────────────────│
│ id (PK)            │
│ user_id (FK)       │
│ type               │
│ status             │
│ payload (JSONB)    │
│ priority           │
│ retry_count        │
│ error_message      │
│ created_at         │
│ updated_at         │
└──────────────────────┘
        │
        │ 1
        │
        │ M
        ▼
┌──────────────────────┐
│  event_executions   │
│──────────────────────│
│ id (PK)            │
│ event_id (FK)      │
│ status             │
│ message            │
│ created_at         │
└──────────────────────┘

┌──────────────────────┐
│     templates       │
│──────────────────────│
│ id (PK)            │
│ name               │
│ description        │
│ content (TEXT)     │
│ schema (JSONB)     │
│ version            │
│ created_by (FK)    │
│ created_at         │
│ updated_at         │
└──────────────────────┘

┌──────────────────────┐
│     workflows       │
│──────────────────────│
│ id (PK)            │
│ name               │
│ description        │
│ trigger_type       │
│ trigger_config     │
│ steps (JSONB)      │
│ status             │
│ created_at         │
│ updated_at         │
└──────────────────────┘

┌──────────────────────┐
│    audit_logs       │
│──────────────────────│
│ id (PK)            │
│ user_id (FK)       │
│ action             │
│ resource_type      │
│ resource_id        │
│ metadata (JSONB)   │
│ ip_address         │
│ created_at         │
└──────────────────────┘
```

### Table Definitions

#### users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### events

```sql
CREATE TYPE event_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE event_priority AS ENUM ('low', 'normal', 'high', 'urgent');

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type VARCHAR(100) NOT NULL,
  status event_status DEFAULT 'pending',
  payload JSONB,
  priority event_priority DEFAULT 'normal',
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_payload ON events USING GIN(payload);
```

#### event_executions

```sql
CREATE TABLE event_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_executions_event_id ON event_executions(event_id);
CREATE INDEX idx_event_executions_created_at ON event_executions(created_at DESC);
```

#### templates

```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  schema JSONB,
  version VARCHAR(20) DEFAULT '1.0.0',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_templates_name ON templates(name);
CREATE INDEX idx_templates_created_by ON templates(created_by);
```

### Connection Pooling

BEO Automation uses `pg-pool` for PostgreSQL connection pooling:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Return error after 2s if no connection
});

export default pool;
```

## Integration Documentation

### Airtable API Integration

#### Configuration

```typescript
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);
```

#### Data Sync Example

```typescript
export async function syncToAirtable(eventData: Event) {
  try {
    const record = await base('Events').create([
      {
        fields: {
          'Event ID': eventData.id,
          'Event Type': eventData.type,
          'Status': eventData.status,
          'Created At': eventData.createdAt,
        },
      },
    ]);
    
    return record[0].id;
  } catch (error) {
    console.error('Airtable sync error:', error);
    throw error;
  }
}
```

### Oz Agent SDK Integration

#### Initialization

```typescript
import { OzAgentSDK } from '@oz-agent/sdk';

const ozAgent = new OzAgentSDK({
  apiKey: process.env.OZ_AGENT_API_KEY,
  endpoint: process.env.OZ_AGENT_ENDPOINT,
});
```

#### Workflow Execution

```typescript
export async function executeWorkflow(
  workflowId: string,
  input: Record<string, any>
) {
  try {
    const execution = await ozAgent.workflows.execute({
      workflowId,
      input,
    });
    
    return execution;
  } catch (error) {
    console.error('Oz Agent execution error:', error);
    throw error;
  }
}
```

## Deployment

### Development Deployment

1. **Install Dependencies**
```bash
npm install
```

2. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Run Database Migrations**
```bash
npm run db:migrate
```

4. **Start Development Server**
```bash
npm run dev
```

### Production Deployment

1. **Build Application**
```bash
npm run build
```

2. **Run Database Migrations**
```bash
NODE_ENV=production npm run db:migrate
```

3. **Start Production Server**
```bash
NODE_ENV=production npm start
```

### Environment Variables

```bash
# Application
NODE_ENV=production
PORT=3000
API_URL=https://api.yourdomain.com

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=beo_automation
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Airtable
AIRTABLE_API_KEY=your-airtable-api-key
AIRTABLE_BASE_ID=your-base-id

# Oz Agent SDK
OZ_AGENT_API_KEY=your-oz-agent-key
OZ_AGENT_ENDPOINT=https://oz-agent-endpoint.com
```

## Configuration

### Database Configuration

Edit `config/database.ts`:

```typescript
export const dbConfig = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'beo_dev',
  },
  production: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
  },
};
```

### CORS Configuration

```typescript
import cors from 'cors';

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

---

**Navigation**:  
[← Back to Project Overview](./01-project-overview.md) | [Next: User Documentation →](./03-user-documentation.md)