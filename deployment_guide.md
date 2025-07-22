# MarketPlanAI - Deployment Guide

**Version:** 1.0  
**Date:** December 2024  
**For:** DevOps Engineers, Technical Leads  
**Target Platform:** Firebase App Hosting  

---

## Table of Contents

1. [Prerequisites and Setup](#1-prerequisites-and-setup)
2. [Environment Configuration](#2-environment-configuration)
3. [Firebase Project Setup](#3-firebase-project-setup)
4. [Build and Deployment Process](#4-build-and-deployment-process)
5. [CI/CD Pipeline Setup](#5-cicd-pipeline-setup)
6. [Production Configuration](#6-production-configuration)
7. [Monitoring and Logging](#7-monitoring-and-logging)
8. [Backup and Disaster Recovery](#8-backup-and-disaster-recovery)
9. [Security Configuration](#9-security-configuration)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites and Setup

### 1.1 Required Tools and Accounts

**Development Tools:**
```bash
# Required software versions
Node.js >= 18.0.0
npm >= 9.0.0
Git >= 2.30.0
Firebase CLI >= 12.0.0
```

**Required Accounts:**
- **Google Cloud Platform account** with billing enabled
- **GitHub/GitLab account** for repository hosting
- **Google AI API access** for Gemini integration
- **Domain registrar account** (if using custom domain)

**Installation Commands:**
```bash
# Install Node.js (using nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install Firebase CLI
npm install -g firebase-tools

# Verify installations
node --version    # Should be >= 18.0.0
npm --version     # Should be >= 9.0.0
firebase --version # Should be >= 12.0.0
```

### 1.2 Project Structure Verification

```bash
# Clone and verify project structure
git clone https://github.com/your-org/marketplan-ai.git
cd marketplan-ai

# Verify key files exist
ls -la package.json
ls -la apphosting.yaml
ls -la next.config.ts
ls -la src/

# Install dependencies
npm install

# Verify build process
npm run build
```

### 1.3 Access and Permissions

**Required Permissions:**
- **Firebase Admin:** Full access to Firebase project
- **Google Cloud Admin:** IAM, App Hosting, Firestore access
- **GitHub Admin:** Repository settings, secrets management
- **Domain Admin:** DNS configuration (if using custom domain)

---

## 2. Environment Configuration

### 2.1 Environment Variables Setup

**Required Environment Variables:**

```bash
# .env.production (production environment)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

GOOGLE_AI_API_KEY=your_gemini_api_key
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com

# Optional: Analytics and monitoring
SENTRY_DSN=your_sentry_dsn
GA_TRACKING_ID=your_google_analytics_id
VERCEL_ANALYTICS_ID=your_vercel_analytics_id

NODE_ENV=production
```

**Staging Environment:**
```bash
# .env.staging
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-staging
GOOGLE_AI_API_KEY=your_staging_gemini_key
NODE_ENV=staging
# ... other staging-specific variables
```

### 2.2 Secrets Management

**Firebase Project Secrets:**
```bash
# Set Firebase secrets
firebase functions:secrets:set GOOGLE_AI_API_KEY
firebase functions:secrets:set FIREBASE_ADMIN_PRIVATE_KEY
firebase functions:secrets:set SENTRY_DSN

# Verify secrets
firebase functions:secrets:access GOOGLE_AI_API_KEY
```

**GitHub Secrets (for CI/CD):**
```yaml
# Required GitHub Repository Secrets
FIREBASE_SERVICE_ACCOUNT_PRODUCTION  # Firebase service account JSON
FIREBASE_SERVICE_ACCOUNT_STAGING     # Staging service account JSON
GOOGLE_AI_API_KEY                    # Google AI API key
SENTRY_DSN                          # Sentry error tracking
```

### 2.3 Configuration Files

**Firebase Configuration:**
```javascript
// firebase.config.js (production)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export default firebaseConfig;
```

**Next.js Configuration:**
```typescript
// next.config.ts (production)
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
    FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  },
  
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif']
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['marketplan-ai.com', 'www.marketplan-ai.com']
    }
  },

  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin'
        }
      ]
    }
  ]
};

export default nextConfig;
```

---

## 3. Firebase Project Setup

### 3.1 Create Firebase Projects

**Production Project:**
```bash
# Login to Firebase
firebase login

# Create new project (or use existing)
firebase projects:create marketplan-ai-prod

# Initialize project locally
firebase init

# Select features:
# - Hosting (for App Hosting)
# - Firestore Database
# - Authentication
# - Functions (if needed)
```

**Staging Project:**
```bash
# Create staging project
firebase projects:create marketplan-ai-staging

# Add staging project alias
firebase use --add marketplan-ai-staging
firebase use staging

# Deploy to staging for testing
firebase deploy --project staging
```

### 3.2 Firebase App Hosting Configuration

**apphosting.yaml Configuration:**
```yaml
# apphosting.yaml (production)
runConfig:
  maxInstances: 10
  minInstances: 1
  concurrency: 100
  cpu: 1
  memoryMiB: 1024
  
env:
  GOOGLE_AI_API_KEY:
    from_parameter: google_ai_api_key
  FIREBASE_ADMIN_PRIVATE_KEY:
    from_parameter: firebase_admin_private_key
  FIREBASE_ADMIN_CLIENT_EMAIL:
    from_parameter: firebase_admin_client_email
  NODE_ENV: production
  
buildConfig:
  runtime: nodejs18
  commands:
    - npm ci --only=production
    - npm run build
  environment:
    NEXT_TELEMETRY_DISABLED: "1"
```

**Staging Configuration:**
```yaml
# apphosting.staging.yaml
runConfig:
  maxInstances: 3
  minInstances: 0
  concurrency: 50
  cpu: 1
  memoryMiB: 512
  
env:
  NODE_ENV: staging
  GOOGLE_AI_API_KEY:
    from_parameter: google_ai_api_key_staging
```

### 3.3 Firestore Database Setup

**Database Configuration:**
```javascript
// firestore.rules (production)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User documents - users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Marketing plans - private to the user
    match /marketing_plans/{planId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId &&
        validateMarketingPlan(request.resource.data);
    }
    
    // AI generation logs - read-only for users, write for system
    match /ai_generations/{logId} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow write: if false; // Only system can write
    }
    
    // Analytics data - system only
    match /analytics/{document=**} {
      allow read, write: if false; // System only
    }
  }

  function validateMarketingPlan(data) {
    return data.keys().hasAll(['userId', 'businessDescription', 'createdAt']) &&
           data.userId is string &&
           data.businessDescription is string &&
           data.createdAt is timestamp;
  }
}
```

**Database Indexes:**
```javascript
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "marketing_plans",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ai_generations",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "timestamp", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### 3.4 Authentication Setup

**Authentication Configuration:**
```bash
# Enable Authentication providers
firebase auth:import --hash-algo bcrypt users.json

# Configure OAuth providers (if needed)
# This is done through Firebase Console:
# Authentication > Sign-in method > Add provider
```

**Auth Configuration Code:**
```typescript
// lib/firebase-auth.ts
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import firebaseConfig from './firebase.config';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Connect to emulator in development
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
}
```

---

## 4. Build and Deployment Process

### 4.1 Manual Deployment

**Pre-deployment Checklist:**
```bash
# 1. Run all tests
npm run test
npm run test:e2e

# 2. Build and verify
npm run build
npm run start # Test production build locally

# 3. Lint and type check
npm run lint
npm run typecheck

# 4. Security audit
npm audit --audit-level high
```

**Manual Deploy Commands:**
```bash
# Deploy to staging
firebase use staging
firebase deploy --project staging

# Deploy to production (with confirmation)
firebase use production
firebase deploy --project production --confirm
```

### 4.2 Deployment Verification

**Post-deployment Checks:**
```bash
# 1. Health check
curl https://marketplan-ai.com/api/health

# 2. AI service check
curl -X POST https://marketplan-ai.com/api/ai/health \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# 3. Database connectivity
curl https://marketplan-ai.com/api/db/health

# 4. Performance check
curl -w "@curl-format.txt" -o /dev/null -s https://marketplan-ai.com/
```

**Curl Format File (curl-format.txt):**
```
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
```

### 4.3 Rollback Procedures

**Automatic Rollback (Firebase App Hosting):**
```bash
# List recent deployments
firebase hosting:deployments:list

# Rollback to previous version
firebase hosting:deployments:rollback DEPLOYMENT_ID
```

**Manual Rollback:**
```bash
# 1. Identify last known good commit
git log --oneline -10

# 2. Create rollback branch
git checkout -b rollback-to-commit-abc123 abc123

# 3. Deploy rollback
firebase deploy --project production

# 4. Verify rollback success
curl https://marketplan-ai.com/api/health
```

---

## 5. CI/CD Pipeline Setup

### 5.1 GitHub Actions Workflow

**Complete CI/CD Pipeline:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase App Hosting

on:
  push:
    branches:
      - main        # Production
      - develop     # Staging
  pull_request:
    branches:
      - main
      - develop

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run typecheck
    
    - name: Run unit tests
      run: npm run test -- --coverage
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
    
    - name: Build application
      run: npm run build
      env:
        GOOGLE_AI_API_KEY: ${{ secrets.GOOGLE_AI_API_KEY }}
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ github.ref == 'refs/heads/main' && 'marketplan-ai-prod' || 'marketplan-ai-staging' }}

  e2e-test:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Start application
      run: npm start &
      
    - name: Wait for application
      run: npx wait-on http://localhost:3000 --timeout 60000
    
    - name: Run E2E tests
      run: npm run e2e:headless
    
    - name: Upload E2E artifacts
      if: failure()
      uses: actions/upload-artifact@v3
      with:
        name: cypress-artifacts
        path: |
          cypress/screenshots
          cypress/videos

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [test]
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for staging
      run: npm run build
      env:
        NODE_ENV: staging
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: marketplan-ai-staging
        GOOGLE_AI_API_KEY: ${{ secrets.GOOGLE_AI_API_KEY }}
    
    - name: Deploy to Firebase App Hosting (Staging)
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: ${{ secrets.GITHUB_TOKEN }}
        firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_STAGING }}
        projectId: marketplan-ai-staging
        channelId: live
        entryPoint: ./
    
    - name: Run smoke tests on staging
      run: |
        sleep 30  # Wait for deployment
        curl -f https://marketplan-ai-staging.web.app/api/health || exit 1

  deploy-production:
    runs-on: ubuntu-latest
    needs: [test, e2e-test]
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for production
      run: npm run build
      env:
        NODE_ENV: production
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: marketplan-ai-prod
        GOOGLE_AI_API_KEY: ${{ secrets.GOOGLE_AI_API_KEY }}
    
    - name: Deploy to Firebase App Hosting (Production)
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: ${{ secrets.GITHUB_TOKEN }}
        firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_PRODUCTION }}
        projectId: marketplan-ai-prod
        channelId: live
        entryPoint: ./
    
    - name: Run production smoke tests
      run: |
        sleep 30  # Wait for deployment
        curl -f https://marketplan-ai.com/api/health || exit 1
        curl -f https://marketplan-ai.com/api/ai/health || exit 1
    
    - name: Notify deployment success
      if: success()
      run: |
        echo "✅ Production deployment successful!"
        echo "🌐 URL: https://marketplan-ai.com"
    
    - name: Notify deployment failure
      if: failure()
      run: |
        echo "❌ Production deployment failed!"
        exit 1

  lighthouse-audit:
    runs-on: ubuntu-latest
    needs: deploy-production
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Run Lighthouse CI
      uses: treosh/lighthouse-ci-action@v9
      with:
        urls: |
          https://marketplan-ai.com
        uploadArtifacts: true
        temporaryPublicStorage: true
```

### 5.2 Branch Protection Rules

**GitHub Branch Protection Settings:**
```yaml
# Branch protection for main branch
protection_rules:
  main:
    required_status_checks:
      strict: true
      contexts:
        - "test"
        - "e2e-test"
    enforce_admins: true
    required_pull_request_reviews:
      required_approving_review_count: 2
      dismiss_stale_reviews: true
      require_code_owner_reviews: true
    restrictions:
      users: []
      teams: ["core-team"]
```

### 5.3 Environment-Specific Deployments

**Staging Environment:**
```yaml
# staging deployment configuration
environment:
  name: staging
  url: https://marketplan-ai-staging.web.app
  
protection_rules:
  required_reviewers: 1
  environment_secrets:
    FIREBASE_SERVICE_ACCOUNT_STAGING: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_STAGING }}
```

**Production Environment:**
```yaml
# production deployment configuration
environment:
  name: production
  url: https://marketplan-ai.com
  
protection_rules:
  required_reviewers: 2
  environment_secrets:
    FIREBASE_SERVICE_ACCOUNT_PRODUCTION: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_PRODUCTION }}
```

---

## 6. Production Configuration

### 6.1 Performance Optimization

**Next.js Production Config:**
```typescript
// next.config.ts (production optimizations)
const nextConfig: NextConfig = {
  // Compression
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    domains: ['firebasestorage.googleapis.com']
  },
  
  // Caching headers
  headers: async () => [
    {
      source: '/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    }
  ],
  
  // Bundle optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  }
};
```

**Firebase App Hosting Optimization:**
```yaml
# apphosting.yaml (production performance)
runConfig:
  maxInstances: 20
  minInstances: 2
  concurrency: 100
  cpu: 2
  memoryMiB: 2048
  
# Auto-scaling configuration
autoScale:
  minInstances: 2
  maxInstances: 20
  targetCpuUtilization: 70
  targetMemoryUtilization: 80
```

### 6.2 Custom Domain Setup

**Domain Configuration:**
```bash
# Add custom domain in Firebase Console
# OR use CLI:
firebase hosting:sites:create marketplan-ai

# Configure custom domain
firebase hosting:sites:get marketplan-ai
```

**DNS Configuration:**
```
# DNS records for custom domain
Type: A
Name: @
Value: 151.101.1.195  # Firebase hosting IP

Type: A  
Name: @
Value: 151.101.65.195  # Firebase hosting IP

Type: CNAME
Name: www
Value: marketplan-ai.web.app
```

**SSL Certificate:**
```bash
# SSL is automatically provisioned by Firebase
# Verify SSL certificate
curl -I https://marketplan-ai.com
```

### 6.3 CDN and Caching

**Firebase CDN Configuration:**
```javascript
// firebase.json
{
  "hosting": {
    "public": ".next/static",
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "**/*.@(png|jpg|jpeg|gif|svg|webp|avif)",
        "headers": [
          {
            "key": "Cache-Control", 
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ],
    "rewrites": [
      {
        "source": "**",
        "function": "nextjsFunc"
      }
    ]
  }
}
```

---

## 7. Monitoring and Logging

### 7.1 Application Monitoring

**Firebase Performance Monitoring:**
```typescript
// lib/performance.ts
import { getPerformance } from 'firebase/performance';
import { app } from './firebase';

export const perf = getPerformance(app);

// Custom performance tracking
export function trackCustomMetric(name: string, value: number) {
  const customMetric = perf.getCustomMetric(name);
  customMetric.record(value);
}
```

**Sentry Error Tracking:**
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  environment: process.env.NODE_ENV,
  
  // Performance monitoring
  tracesSampleRate: 0.1,
  
  // Error filtering
  beforeSend(event) {
    // Filter out development errors
    if (event.environment === 'development') {
      return null;
    }
    
    // Remove sensitive data
    if (event.extra?.businessDescription) {
      delete event.extra.businessDescription;
    }
    
    return event;
  },
  
  // Integration configuration
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'marketplan-ai.com']
    })
  ]
});
```

### 7.2 Logging Configuration

**Application Logging:**
```typescript
// lib/logger.ts
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

// Add file transport for production
if (process.env.NODE_ENV === 'production') {
  logger.add(new transports.File({
    filename: 'logs/error.log',
    level: 'error'
  }));
  
  logger.add(new transports.File({
    filename: 'logs/combined.log'
  }));
}

export default logger;
```

**AI Usage Logging:**
```typescript
// lib/ai-analytics.ts
import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function logAIGeneration(data: {
  userId: string;
  inputLength: number;
  outputSections: string[];
  processingTime: number;
  success: boolean;
  errorMessage?: string;
}) {
  try {
    await addDoc(collection(db, 'ai_generations'), {
      ...data,
      timestamp: Timestamp.now(),
      modelVersion: 'gemini-2.0-flash',
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Failed to log AI generation:', error);
  }
}
```

### 7.3 Health Checks and Alerts

**Health Check Endpoints:**
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    uptime: process.uptime()
  };

  return NextResponse.json(health);
}

// app/api/ai/health/route.ts
import { NextResponse } from 'next/server';
import { ai } from '@/ai/genkit';

export async function POST() {
  try {
    // Test AI service with minimal request
    const testResult = await ai.generate({
      prompt: 'Test prompt',
      model: 'googleai/gemini-2.0-flash'
    });

    return NextResponse.json({
      status: 'healthy',
      aiService: 'operational',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      aiService: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}
```

**Uptime Monitoring:**
```yaml
# uptime-monitoring.yml (external service configuration)
monitors:
  - name: "MarketPlanAI Homepage"
    url: "https://marketplan-ai.com"
    method: "GET"
    expected_status: 200
    interval: 60  # seconds
    
  - name: "Health Check API"
    url: "https://marketplan-ai.com/api/health"
    method: "GET"
    expected_status: 200
    interval: 120
    
  - name: "AI Service Health"
    url: "https://marketplan-ai.com/api/ai/health"
    method: "POST"
    expected_status: 200
    interval: 300
    headers:
      Content-Type: "application/json"
    body: '{"test": true}'

alerts:
  email: ["devops@marketplan-ai.com"]
  slack: "#alerts"
  escalation_policy: "critical-services"
```

---

## 8. Backup and Disaster Recovery

### 8.1 Database Backup Strategy

**Firestore Backup Configuration:**
```bash
# Enable automatic backups
gcloud firestore operations list

# Create backup schedule
gcloud alpha firestore backups schedules create \
  --database="(default)" \
  --recurrence=daily \
  --retention=7d

# Manual backup
gcloud firestore export gs://marketplan-ai-backups/$(date +%Y-%m-%d)
```

**Backup Verification Script:**
```bash
#!/bin/bash
# backup-verify.sh

BACKUP_BUCKET="gs://marketplan-ai-backups"
DATE=$(date +%Y-%m-%d)
BACKUP_PATH="$BACKUP_BUCKET/$DATE"

# Check if backup exists
if gsutil ls "$BACKUP_PATH" >/dev/null 2>&1; then
    echo "✅ Backup verified for $DATE"
    
    # Check backup size
    SIZE=$(gsutil du -s "$BACKUP_PATH" | awk '{print $1}')
    if [ "$SIZE" -gt 1000000 ]; then  # > 1MB
        echo "✅ Backup size acceptable: $SIZE bytes"
    else
        echo "⚠️ Backup size seems small: $SIZE bytes"
    fi
else
    echo "❌ Backup missing for $DATE"
    exit 1
fi
```

### 8.2 Application Backup

**Source Code Backup:**
```bash
# Automated repository backup
#!/bin/bash
# backup-repository.sh

REPO_URL="https://github.com/your-org/marketplan-ai.git"
BACKUP_DIR="/backups/marketplan-ai-$(date +%Y-%m-%d)"

# Clone repository
git clone --mirror "$REPO_URL" "$BACKUP_DIR"

# Compress backup
tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"

# Upload to backup storage
gsutil cp "$BACKUP_DIR.tar.gz" gs://marketplan-ai-backups/repository/

# Cleanup local backup
rm -rf "$BACKUP_DIR" "$BACKUP_DIR.tar.gz"

echo "Repository backup completed"
```

**Configuration Backup:**
```bash
# backup-config.sh
#!/bin/bash

CONFIG_BACKUP_DIR="/tmp/config-backup-$(date +%Y-%m-%d)"
mkdir -p "$CONFIG_BACKUP_DIR"

# Export Firebase configuration
firebase projects:list > "$CONFIG_BACKUP_DIR/projects.json"
firebase use --add marketplan-ai-prod
firebase functions:config:get > "$CONFIG_BACKUP_DIR/functions-config.json"

# Export environment variables (secrets removed)
env | grep -E '^(NEXT_|NODE_|FIREBASE_PROJECT)' > "$CONFIG_BACKUP_DIR/env-vars.txt"

# Compress and upload
tar -czf "config-backup-$(date +%Y-%m-%d).tar.gz" "$CONFIG_BACKUP_DIR"
gsutil cp "config-backup-$(date +%Y-%m-%d).tar.gz" gs://marketplan-ai-backups/config/

# Cleanup
rm -rf "$CONFIG_BACKUP_DIR" "config-backup-$(date +%Y-%m-%d).tar.gz"
```

### 8.3 Disaster Recovery Plan

**Recovery Time Objectives (RTO):**
- **Critical Service Restoration:** 4 hours
- **Full Service Restoration:** 24 hours
- **Data Recovery:** 2 hours

**Recovery Point Objectives (RPO):**
- **Database:** 24 hours (daily backups)
- **Configuration:** 7 days (weekly backups)
- **Source Code:** Real-time (Git repository)

**Recovery Procedures:**

**1. Database Recovery:**
```bash
# Restore Firestore from backup
gcloud firestore import gs://marketplan-ai-backups/YYYY-MM-DD

# Verify data integrity
firebase firestore:query --limit 10 marketing_plans
```

**2. Application Recovery:**
```bash
# 1. Create new Firebase project if needed
firebase projects:create marketplan-ai-recovery

# 2. Restore from repository backup
git clone gs://marketplan-ai-backups/repository/latest.git

# 3. Deploy to recovery environment
firebase use marketplan-ai-recovery
firebase deploy

# 4. Update DNS to point to recovery environment
# Update DNS A records to new Firebase hosting
```

**3. Rollback Procedures:**
```bash
# Quick rollback to previous deployment
firebase hosting:deployments:list
firebase hosting:deployments:rollback PREVIOUS_DEPLOYMENT_ID

# Full environment rollback
git checkout main
git reset --hard KNOWN_GOOD_COMMIT
firebase deploy --force
```

---

## 9. Security Configuration

### 9.1 Network Security

**Firewall Rules:**
```bash
# Google Cloud firewall rules
gcloud compute firewall-rules create allow-https \
  --allow tcp:443 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow HTTPS traffic"

gcloud compute firewall-rules create allow-http-redirect \
  --allow tcp:80 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow HTTP for HTTPS redirect"
```

**Rate Limiting:**
```typescript
// middleware/rate-limit.ts
import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT_REQUESTS = 100; // requests
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimitMiddleware(request: NextRequest) {
  const clientIP = request.ip || 'unknown';
  const now = Date.now();
  
  const clientData = requestCounts.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize counter
    requestCounts.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return NextResponse.next();
  }
  
  if (clientData.count >= RATE_LIMIT_REQUESTS) {
    return new NextResponse('Rate limit exceeded', { status: 429 });
  }
  
  clientData.count++;
  return NextResponse.next();
}
```

### 9.2 Data Protection

**CORS Configuration:**
```typescript
// lib/cors.ts
import { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://marketplan-ai.com',
  'https://www.marketplan-ai.com',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
];

export function corsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return {};
  }
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };
}
```

**Input Validation:**
```typescript
// lib/validation.ts
import { z } from 'zod';

export const businessDescriptionSchema = z.object({
  businessDescription: z.string()
    .min(50, 'Business description must be at least 50 characters')
    .max(2000, 'Business description cannot exceed 2000 characters')
    .trim()
    .refine(
      (desc) => !desc.includes('<script'),
      'Business description contains invalid content'
    )
});

export const marketingPlanSchema = z.object({
  userId: z.string().uuid(),
  businessDescription: z.string().min(50).max(2000),
  situationAnalysis: z.object({
    strengths: z.array(z.string().max(500)).max(10),
    weaknesses: z.array(z.string().max(500)).max(10),
    opportunities: z.array(z.string().max(500)).max(10),
    threats: z.array(z.string().max(500)).max(10),
    competitors: z.array(z.object({
      name: z.string().max(100),
      analysis: z.string().max(1000)
    })).max(5)
  }).optional(),
  // ... other sections
});
```

### 9.3 API Security

**Authentication Middleware:**
```typescript
// middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyIdToken } from 'firebase-admin/auth';

export async function authMiddleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decodedToken = await verifyIdToken(token);
    
    // Add user info to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decodedToken.uid);
    requestHeaders.set('x-user-email', decodedToken.email || '');
    
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  } catch (error) {
    return new NextResponse('Invalid token', { status: 401 });
  }
}
```

**API Route Protection:**
```typescript
// app/api/plans/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/auth';
import { rateLimitMiddleware } from '@/middleware/rate-limit';

export async function POST(request: NextRequest) {
  // Apply middleware
  const authResponse = await authMiddleware(request);
  if (authResponse.status !== 200) return authResponse;
  
  const rateLimitResponse = rateLimitMiddleware(request);
  if (rateLimitResponse.status !== 200) return rateLimitResponse;
  
  // Process request
  const userId = request.headers.get('x-user-id');
  // ... API logic
}
```

---

## 10. Troubleshooting

### 10.1 Common Deployment Issues

**Build Failures:**

**Issue:** "Module not found" errors during build
```bash
# Solution 1: Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run build

# Solution 2: Check for missing dependencies
npm audit
npm install --save missing-package-name

# Solution 3: Verify Node.js version
node --version  # Should be >= 18.0.0
```

**Issue:** "Out of memory" during build
```yaml
# Solution: Increase memory in apphosting.yaml
runConfig:
  memoryMiB: 2048  # Increase from 1024
  
buildConfig:
  environment:
    NODE_OPTIONS: "--max-old-space-size=4096"
```

**Firebase Deployment Issues:**

**Issue:** "Permission denied" during deployment
```bash
# Solution: Re-authenticate and check permissions
firebase logout
firebase login
firebase projects:list

# Check IAM permissions in Google Cloud Console
# Required roles: Firebase Admin, App Hosting Admin
```

**Issue:** "Quota exceeded" errors
```bash
# Check quotas in Google Cloud Console
gcloud compute project-info describe --project=your-project-id

# Request quota increase if needed
# Console: IAM & Admin > Quotas
```

### 10.2 Runtime Issues

**AI Service Failures:**

**Issue:** "AI generation timeout" errors
```typescript
// Solution: Implement retry logic
async function generateWithRetry(input: any, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateMarketingPlan(input);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

**Issue:** "API quota exceeded" errors
```typescript
// Solution: Implement usage tracking
const quotaLimiter = new Map<string, number>();

function checkQuota(userId: string): boolean {
  const userUsage = quotaLimiter.get(userId) || 0;
  const dailyLimit = 10; // requests per day
  
  if (userUsage >= dailyLimit) {
    return false;
  }
  
  quotaLimiter.set(userId, userUsage + 1);
  return true;
}
```

**Database Connection Issues:**

**Issue:** "Firestore connection failed"
```typescript
// Solution: Check connection and retry
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

const db = getFirestore();

// Add connection retry logic
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new Error('Max retries exceeded');
}
```

### 10.3 Performance Issues

**Slow Page Load Times:**

**Issue:** Large bundle sizes affecting performance
```bash
# Analyze bundle size
npm run build
npm run analyze

# Solutions:
# 1. Enable code splitting
# 2. Optimize images
# 3. Remove unused dependencies
# 4. Use dynamic imports
```

**Issue:** Slow AI response times
```typescript
// Solution: Implement caching
const responseCache = new Map<string, any>();

async function generateWithCache(input: string) {
  const cacheKey = hashInput(input);
  
  if (responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey);
  }
  
  const result = await generateMarketingPlan(input);
  responseCache.set(cacheKey, result);
  
  return result;
}
```

### 10.4 Monitoring and Debugging

**Enable Debug Logging:**
```bash
# Environment variable for debug mode
DEBUG=marketplan:* npm start

# Firebase debug mode
firebase --debug deploy
```

**Performance Monitoring:**
```typescript
// Add performance monitoring
import { performance } from 'perf_hooks';

export function measurePerformance<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      console.log(`${label}: ${duration.toFixed(2)}ms`);
      resolve(result);
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`${label} failed after ${duration.toFixed(2)}ms:`, error);
      reject(error);
    }
  });
}
```

**Health Check Dashboard:**
```bash
# Create simple health check script
#!/bin/bash
# health-check.sh

echo "🔍 Checking MarketPlanAI Health..."

# Check main site
if curl -sf https://marketplan-ai.com/api/health > /dev/null; then
    echo "✅ Main site: OK"
else
    echo "❌ Main site: FAILED"
fi

# Check AI service
if curl -sf -X POST https://marketplan-ai.com/api/ai/health > /dev/null; then
    echo "✅ AI service: OK"
else
    echo "❌ AI service: FAILED"
fi

# Check database
if curl -sf https://marketplan-ai.com/api/db/health > /dev/null; then
    echo "✅ Database: OK"
else
    echo "❌ Database: FAILED"
fi

echo "✅ Health check completed"
```

---

## Quick Reference

### Essential Commands
```bash
# Deploy to staging
firebase use staging && firebase deploy

# Deploy to production
firebase use production && firebase deploy --confirm

# Health check
curl https://marketplan-ai.com/api/health

# View logs
firebase functions:log

# Rollback deployment
firebase hosting:deployments:rollback DEPLOYMENT_ID
```

### Emergency Contacts
- **Technical Lead:** [Contact Info]
- **DevOps Engineer:** [Contact Info]
- **On-call Engineer:** [Contact Info]
- **Firebase Support:** [Support Link]

---

*This deployment guide ensures reliable, secure, and scalable deployment of MarketPlanAI to production environments.* 