# Maintenance Guide

> **Linear Ticket**: LAU-220  
> **Document**: Operations, Monitoring, and Maintenance

## Table of Contents

- [Monitoring and Logging](#monitoring-and-logging)
- [Error Handling and Debugging](#error-handling-and-debugging)
- [Database Maintenance](#database-maintenance)
- [Security](#security)
- [Performance Optimization](#performance-optimization)
- [Backup and Recovery](#backup-and-recovery)
- [Update and Upgrade](#update-and-upgrade)
- [Incident Response](#incident-response)

## Monitoring and Logging

### Monitoring Setup

#### Application-Level Monitoring

**Health Check Endpoint**

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  const checks = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      database: await checkDatabase(),
      memory: checkMemory(),
      diskSpace: checkDiskSpace(),
    },
  };

  const allHealthy = Object.values(checks.checks).every(
    (check) => check.status === 'ok'
  );

  return NextResponse.json(checks, {
    status: allHealthy ? 200 : 503,
  });
}

async function checkDatabase() {
  try {
    const result = await pool.query('SELECT 1');
    return {
      status: 'ok',
      latency: result.duration || 0,
    };
  } catch (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }
}

function checkMemory() {
  const usage = process.memoryUsage();
  const heapUsedPercent = (usage.heapUsed / usage.heapTotal) * 100;
  
  return {
    status: heapUsedPercent < 90 ? 'ok' : 'warning',
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    percentage: `${heapUsedPercent.toFixed(2)}%`,
  };
}
```

#### Key Metrics to Monitor

| Metric | Alert Threshold | Description |
|--------|----------------|-------------|
| **Response Time** | > 1000ms | Average API response time |
| **Error Rate** | > 1% | Percentage of failed requests |
| **Database Connections** | > 80% of pool | Active database connections |
| **Memory Usage** | > 85% | Heap memory utilization |
| **Event Queue Size** | > 1000 | Pending events to process |
| **CPU Usage** | > 80% | Server CPU utilization |
| **Disk Usage** | > 85% | Available disk space |

### Logging Implementation

#### Logger Setup

```typescript
// lib/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'beo-automation',
    environment: process.env.NODE_ENV,
  },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // Write errors to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // Write all logs to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

export default logger;
```

#### Logging Best Practices

```typescript
// ✅ Good: Structured logging with context
logger.info('Event processed successfully', {
  eventId: event.id,
  eventType: event.type,
  duration: processingTime,
  userId: user.id,
});

// ✅ Good: Error logging with stack trace
logger.error('Failed to process event', {
  eventId: event.id,
  error: error.message,
  stack: error.stack,
});

// ❌ Bad: Unstructured logging
console.log('Event processed: ' + event.id);

// ❌ Bad: Missing context
logger.error('Error occurred');
```

#### Log Levels

- **error**: Errors requiring immediate attention
- **warn**: Warning conditions that should be reviewed
- **info**: General informational messages
- **http**: HTTP request/response logs
- **debug**: Detailed debugging information

### Alerting

#### Setting Up Alerts

```typescript
// lib/utils/alerting.ts
import logger from './logger';

interface AlertConfig {
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  metadata?: Record<string, any>;
}

export async function sendAlert(config: AlertConfig) {
  logger.error('ALERT: ' + config.name, {
    severity: config.severity,
    message: config.message,
    metadata: config.metadata,
  });

  // Send to external alerting service (e.g., PagerDuty, Slack)
  if (config.severity === 'critical') {
    await notifyOncall(config);
  }

  // Store alert in database
  await storeAlert(config);
}

// Example usage
if (errorRate > 0.05) {
  await sendAlert({
    name: 'High Error Rate',
    severity: 'high',
    message: `Error rate at ${(errorRate * 100).toFixed(2)}%`,
    metadata: { errorRate, threshold: 0.05 },
  });
}
```

## Error Handling and Debugging

### Error Handling Strategy

#### Application-Level Error Handler

```typescript
// lib/middleware/error.middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import logger from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(error: Error, req: NextRequest) {
  logger.error('Error occurred', {
    error: error.message,
    stack: error.stack,
    path: req.nextUrl.pathname,
    method: req.method,
  });

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.statusCode,
          message: error.message,
        },
      },
      { status: error.statusCode }
    );
  }

  // Unknown error - don't leak details
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 500,
        message: 'Internal server error',
      },
    },
    { status: 500 }
  );
}
```

#### Custom Error Classes

```typescript
// lib/utils/errors.ts
import { AppError } from '../middleware/error.middleware';

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(500, message, false);
  }
}
```

### Debugging Techniques

#### Enable Debug Logging

```bash
# Set environment variable
export LOG_LEVEL=debug
npm run dev
```

#### Using Node.js Inspector

```bash
# Start with inspector
node --inspect npm run dev

# Then open Chrome DevTools:
# chrome://inspect
```

#### Database Query Debugging

```typescript
// Enable query logging
import { pool } from '@/lib/db';

pool.on('query', (query) => {
  logger.debug('Database query', {
    text: query.text,
    values: query.values,
  });
});
```

#### Performance Profiling

```typescript
// lib/utils/profiler.ts
export function profile(label: string) {
  const start = Date.now();
  
  return () => {
    const duration = Date.now() - start;
    logger.debug(`[Profile] ${label}`, { duration: `${duration}ms` });
  };
}

// Usage
const endProfile = profile('Event Processing');
// ... do work ...
endProfile();
```

## Database Maintenance

### Regular Maintenance Tasks

#### 1. Vacuum and Analyze

Run weekly to reclaim storage and update statistics:

```sql
-- Vacuum all tables
VACUUM ANALYZE;

-- Vacuum specific table
VACUUM ANALYZE events;

-- Full vacuum (requires exclusive lock)
VACUUM FULL events;
```

#### 2. Index Maintenance

Reindex monthly or after bulk operations:

```sql
-- Reindex specific table
REINDEX TABLE events;

-- Reindex all tables in database
REINDEX DATABASE beo_automation;
```

#### 3. Archive Old Data

```sql
-- Archive events older than 90 days
BEGIN;

-- Copy to archive table
INSERT INTO events_archive
SELECT * FROM events
WHERE status = 'completed'
  AND created_at < NOW() - INTERVAL '90 days';

-- Delete from main table
DELETE FROM events
WHERE status = 'completed'
  AND created_at < NOW() - INTERVAL '90 days';

COMMIT;
```

#### 4. Monitor Table Bloat

```sql
-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Connection Pool Management

```typescript
// lib/db/index.ts
import { Pool } from 'pg';
import logger from '../utils/logger';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,                      // Maximum pool size
  idleTimeoutMillis: 30000,     // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Fail fast if can't connect
});

// Monitor pool health
pool.on('connect', () => {
  logger.debug('New database connection established');
});

pool.on('error', (err) => {
  logger.error('Unexpected database error', { error: err.message });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing database connections');
  await pool.end();
  process.exit(0);
});

export default pool;
```

### Query Performance Optimization

#### Identify Slow Queries

```sql
-- Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log queries > 1s
SELECT pg_reload_conf();

-- View slow queries from logs
SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

#### Add Missing Indexes

```sql
-- Find missing indexes
SELECT
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.1;

-- Create index
CREATE INDEX CONCURRENTLY idx_events_created_at 
ON events(created_at DESC);
```

## Security

### Security Best Practices

#### 1. Environment Variables

```bash
# Never commit sensitive data
# Use strong, unique secrets

# Generate secure JWT secret
openssl rand -base64 32

# Generate secure database password
openssl rand -base64 24
```

#### 2. API Authentication

```typescript
// lib/middleware/auth.middleware.ts
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { UnauthorizedError } from '../utils/errors';

export async function authenticateRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expired');
    }
    throw new UnauthorizedError('Invalid token');
  }
}
```

#### 3. SQL Injection Prevention

```typescript
// ✅ Good: Use parameterized queries
const result = await pool.query(
  'SELECT * FROM events WHERE id = $1 AND user_id = $2',
  [eventId, userId]
);

// ❌ Bad: String concatenation
const result = await pool.query(
  `SELECT * FROM events WHERE id = '${eventId}'`
);
```

#### 4. Rate Limiting

```typescript
// lib/middleware/rate-limit.middleware.ts
import { LRUCache } from 'lru-cache';

const rateLimitCache = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export function rateLimit(maxRequests = 100) {
  return async (req: NextRequest) => {
    const ip = req.ip || 'unknown';
    const requests = (rateLimitCache.get(ip) as number) || 0;
    
    if (requests >= maxRequests) {
      throw new AppError(429, 'Too many requests');
    }
    
    rateLimitCache.set(ip, requests + 1);
  };
}
```

#### 5. Input Validation

```typescript
// lib/utils/validation.ts
import { z } from 'zod';

export const createEventSchema = z.object({
  type: z.string().min(1).max(100),
  payload: z.record(z.any()),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
});

// Usage
try {
  const validData = createEventSchema.parse(requestBody);
  // Process validData
} catch (error) {
  if (error instanceof z.ZodError) {
    throw new ValidationError(error.message);
  }
}
```

### Security Checklist

- [ ] All API endpoints authenticated
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Parameterized database queries
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Dependencies up to date
- [ ] Secrets in environment variables
- [ ] Error messages don't leak sensitive data
- [ ] Audit logs enabled

## Performance Optimization

### Application Performance

#### 1. Caching Strategy

```typescript
// lib/utils/cache.ts
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cached = cache.get(key) as T;
  
  if (cached) {
    return cached;
  }
  
  const fresh = await fetcher();
  cache.set(key, fresh, { ttl });
  return fresh;
}

// Usage
const events = await cached(
  `events:user:${userId}`,
  () => eventRepository.findByUser(userId),
  1000 * 60 * 10 // 10 minutes
);
```

#### 2. Database Query Optimization

```typescript
// ✅ Good: Select only needed columns
const events = await pool.query(
  'SELECT id, type, status FROM events WHERE user_id = $1',
  [userId]
);

// ❌ Bad: Select all columns
const events = await pool.query(
  'SELECT * FROM events WHERE user_id = $1',
  [userId]
);

// ✅ Good: Use pagination
const events = await pool.query(
  'SELECT * FROM events ORDER BY created_at DESC LIMIT $1 OFFSET $2',
  [limit, offset]
);
```

#### 3. Async Operations

```typescript
// ✅ Good: Parallel execution
const [events, templates, workflows] = await Promise.all([
  eventService.getAll(),
  templateService.getAll(),
  workflowService.getAll(),
]);

// ❌ Bad: Sequential execution
const events = await eventService.getAll();
const templates = await templateService.getAll();
const workflows = await workflowService.getAll();
```

### Frontend Performance

#### 1. Code Splitting

```typescript
// ✅ Good: Dynamic imports
import dynamic from 'next/dynamic';

const EventEditor = dynamic(() => import('./EventEditor'), {
  loading: () => <p>Loading...</p>,
});

export function EventPage() {
  return <EventEditor />;
}
```

#### 2. Image Optimization

```typescript
// ✅ Good: Use Next.js Image component
import Image from 'next/image';

export function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={200}
      height={50}
      priority
    />
  );
}
```

## Backup and Recovery

### Database Backup

#### Automated Daily Backups

```bash
#!/bin/bash
# backup.sh - Run daily via cron

BACKUP_DIR="/var/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/beo_automation_$DATE.sql.gz"

# Create backup
pg_dump -U $DB_USER -h $DB_HOST $DB_NAME | gzip > $BACKUP_FILE

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Upload to cloud storage
aws s3 cp $BACKUP_FILE s3://your-bucket/backups/

echo "Backup completed: $BACKUP_FILE"
```

#### Restore from Backup

```bash
# Restore from compressed backup
gunzip < backup.sql.gz | psql -U $DB_USER -h $DB_HOST $DB_NAME

# Or restore from uncompressed
psql -U $DB_USER -h $DB_HOST $DB_NAME < backup.sql
```

### Application State Backup

```bash
# Backup environment configuration
cp .env .env.backup.$(date +%Y%m%d)

# Backup uploaded files (if any)
tar -czf uploads_backup.tar.gz public/uploads/
```

## Update and Upgrade

### Update Schedule

- **Security Updates**: Immediately
- **Dependency Updates**: Monthly
- **Feature Releases**: Quarterly
- **Major Versions**: Annually

### Update Process

```bash
# 1. Check for updates
npm outdated

# 2. Update dependencies
npm update

# 3. Run tests
npm test

# 4. Update lock file
npm install

# 5. Commit changes
git add package.json package-lock.json
git commit -m "chore: update dependencies"
```

### Database Migrations

```bash
# Create new migration
npm run migration:create -- add_new_column

# Run migrations
npm run migration:run

# Rollback migration
npm run migration:revert
```

## Incident Response

### Incident Response Procedure

1. **Detect**: Monitor alerts, user reports
2. **Assess**: Determine severity and impact
3. **Respond**: Implement fix or workaround
4. **Communicate**: Update stakeholders
5. **Resolve**: Verify fix in production
6. **Post-mortem**: Document and learn

### Incident Severity Levels

| Level | Definition | Response Time | Example |
|-------|------------|---------------|----------|
| **Critical** | Complete outage | 15 minutes | Database down |
| **High** | Major functionality broken | 1 hour | Auth system failing |
| **Medium** | Partial functionality impaired | 4 hours | Slow API responses |
| **Low** | Minor issues | 24 hours | UI glitch |

---

**Navigation**:  
[← Back to Development Guide](./04-development-guide.md) | [↺ Return to Documentation Home](./README.md)