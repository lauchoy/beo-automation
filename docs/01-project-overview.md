# Project Overview

> **Linear Ticket**: LAU-220  
> **Document**: Project Overview and Architecture

## Table of Contents

- [Purpose](#purpose)
- [Goals and Objectives](#goals-and-objectives)
- [Key Components](#key-components)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Use Cases](#use-cases)

## Purpose

The BEO (Backend Engineering Operations) Automation project is designed to **streamline backend engineering operations and event management workflows through intelligent automation**.

In modern development environments, managing business events, coordinating workflows, and maintaining integrations across multiple systems can be complex and time-consuming. BEO Automation addresses these challenges by providing:

- **Automated Event Processing**: Automatic handling of business events without manual intervention
- **Real-time Monitoring**: Live dashboard for tracking workflow status and system health
- **Seamless Integrations**: Built-in connections to Airtable and Oz Agent SDK
- **Template-based Document Generation**: Consistent, reusable document templates using TSX
- **Centralized Operations**: Single platform for managing all backend engineering operations

## Goals and Objectives

### Primary Goals

1. **Automation First**
   - Reduce manual intervention in routine operations
   - Automate business event processing from ingestion to completion
   - Enable self-service workflows for common tasks

2. **Real-time Visibility**
   - Provide live monitoring of all automation workflows
   - Track event processing status in real-time
   - Generate actionable insights from operational data

3. **Extensible Integration**
   - Support multiple external services (Airtable, Oz Agent SDK)
   - Enable easy addition of new integrations
   - Maintain consistent API patterns across integrations

4. **Developer Productivity**
   - Streamline backend engineering workflows
   - Reduce time spent on operational tasks
   - Provide clear documentation and intuitive interfaces

### Success Metrics

- **Efficiency**: 70% reduction in manual event processing time
- **Reliability**: 99.5% uptime for automation workflows
- **Adoption**: 100% of eligible workflows migrated to automation
- **Performance**: Sub-second response times for API operations

## Key Components

BEO Automation consists of four primary components:

### 1. Node.js Backend

**Purpose**: Core business logic and API services

- RESTful API endpoints for all operations
- Event processing engine
- Integration management
- Authentication and authorization
- Background job processing

**Technologies**: Node.js v18+, Express.js, TypeScript

### 2. Next.js Frontend

**Purpose**: User interface and dashboard

- Interactive dashboard for monitoring workflows
- BEO document creation and management interface
- Template builder and editor
- Real-time status updates
- Responsive design for mobile and desktop

**Technologies**: Next.js 14+, React 18+, TypeScript, Tailwind CSS

### 3. PostgreSQL Database

**Purpose**: Persistent data storage

- Event storage and history
- User authentication data
- Workflow configurations
- Template definitions
- Audit logs

**Technologies**: PostgreSQL v14+, connection pooling, automated backups

### 4. External Integrations

**Purpose**: Connect to external services

#### Airtable API Integration
- Sync data with Airtable bases
- Two-way data synchronization
- Custom field mapping
- Webhook support for real-time updates

#### Oz Agent SDK
- Automation workflow execution
- Agent-based task processing
- Event triggering and monitoring
- Custom automation rules

## Technology Stack

### Core Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|----------|
| **Runtime** | Node.js | v18+ | JavaScript runtime environment |
| **Language** | TypeScript | 5.x | Type-safe development |
| **Frontend Framework** | Next.js | 14+ | React-based web framework |
| **UI Library** | React | 18+ | Component-based UI |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS framework |
| **Database** | PostgreSQL | v14+ | Relational database |
| **Authentication** | JWT | Latest | Token-based authentication |
| **API Client** | Airtable API | Latest | External data integration |
| **Automation SDK** | Oz Agent SDK | Latest | Workflow automation |

### Development Dependencies

- **TypeScript** - Static type checking
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Jest** - Unit testing framework
- **Supertest** - API endpoint testing
- **Playwright** - End-to-end testing

### Infrastructure

- **Version Control**: Git / GitHub
- **CI/CD**: GitHub Actions
- **Hosting**: TBD (Cloud platform)
- **Monitoring**: Application-level logging and metrics

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│                     (Next.js Frontend)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Dashboard   │  │   Template   │  │    Event     │        │
│  │     UI       │  │    Editor    │  │   Monitor    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
│                     (Node.js Backend)                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │     API      │  │    Event     │  │  Integration │        │
│  │   Gateway    │  │  Processor   │  │   Manager    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │     Auth     │  │   Template   │  │   Workflow   │        │
│  │   Service    │  │    Engine    │  │   Executor   │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Data Layer                               │
│                   (PostgreSQL Database)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │    Events    │  │   Templates  │  │    Users     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Workflows   │  │  Audit Logs  │  │   Configs    │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     External Services                           │
│  ┌──────────────────────────┐  ┌──────────────────────────┐   │
│  │     Airtable API         │  │     Oz Agent SDK         │   │
│  │  - Data sync             │  │  - Workflow automation   │   │
│  │  - Webhooks              │  │  - Agent tasks           │   │
│  └──────────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

1. **User Request Flow**:
   - User interacts with Next.js frontend
   - Frontend sends authenticated API request to backend
   - Backend validates JWT token
   - Backend processes request and queries database
   - Backend returns response to frontend
   - Frontend updates UI

2. **Event Processing Flow**:
   - Event triggered (manual or automated)
   - Event processor validates and enriches event data
   - Event stored in PostgreSQL database
   - Workflow executor determines automation rules
   - External integrations called (Airtable, Oz Agent SDK)
   - Status updated in real-time
   - Notifications sent to relevant users

3. **Template Rendering Flow**:
   - User selects/creates template
   - Template engine loads TSX template
   - Data merged with template
   - Document generated and rendered
   - Document saved and/or exported

## Key Features

### 1. Automated Event Processing

- **Event Ingestion**: Accept events from multiple sources
- **Rule Engine**: Define custom automation rules
- **Workflow Execution**: Automatic execution based on rules
- **Error Handling**: Automatic retry with exponential backoff
- **Audit Trail**: Complete history of all event processing

### 2. Real-time Monitoring Dashboard

- **Live Status**: Real-time workflow status updates
- **Performance Metrics**: Track processing times and success rates
- **Alert System**: Configurable alerts for failures and delays
- **Search & Filter**: Advanced search across all events
- **Export Capabilities**: Export data for analysis

### 3. Template System

- **TSX-based Templates**: Write templates in TypeScript/JSX
- **Dynamic Data**: Bind data to templates at runtime
- **Reusable Components**: Create component libraries
- **Version Control**: Track template changes over time
- **Preview Mode**: Preview before generating documents

### 4. External Integrations

- **Airtable Integration**:
  - Bi-directional sync
  - Custom field mapping
  - Webhook support
  - Batch operations

- **Oz Agent SDK**:
  - Workflow automation
  - Custom agent creation
  - Event-driven triggers
  - Task scheduling

### 5. Security & Authentication

- **JWT Authentication**: Secure token-based auth
- **Role-based Access Control (RBAC)**: Granular permissions
- **API Key Management**: Secure external API credentials
- **Audit Logging**: Track all user actions
- **Data Encryption**: At-rest and in-transit encryption

## Use Cases

### 1. Automated Event Management

**Scenario**: Automatically process business events from various sources

**Solution**: 
- Configure event ingestion rules
- Define automation workflows
- Set up Airtable sync for tracking
- Monitor through dashboard

**Benefits**: 70% reduction in manual processing time

### 2. Document Generation

**Scenario**: Generate consistent documents from templates

**Solution**:
- Create TSX-based templates
- Define data bindings
- Use template engine for generation
- Export to desired format

**Benefits**: Consistent formatting, reduced errors

### 3. Workflow Automation

**Scenario**: Automate complex multi-step workflows

**Solution**:
- Define workflow steps in Oz Agent SDK
- Set up triggers and conditions
- Configure notifications
- Monitor execution in real-time

**Benefits**: Faster execution, reduced manual intervention

### 4. Data Synchronization

**Scenario**: Keep Airtable bases in sync with application data

**Solution**:
- Configure bi-directional sync
- Set up field mappings
- Enable webhooks for real-time updates
- Monitor sync status

**Benefits**: Single source of truth, real-time updates

## Next Steps

Now that you understand the project overview, proceed to:

- **[Technical Documentation →](./02-technical-documentation.md)** for detailed architecture and API information
- **[User Documentation →](./03-user-documentation.md)** for setup and usage instructions
- **[Development Guide →](./04-development-guide.md)** for contributing to the project

---

**Navigation**:  
[← Back to Documentation Home](./README.md) | [Next: Technical Documentation →](./02-technical-documentation.md)