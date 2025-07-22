# MarketPlanAI - API Documentation

**Version:** 1.0  
**Date:** December 2024  
**Base URL:** `https://marketplan-ai.com/api`  
**Protocol:** HTTPS  

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [AI Generation APIs](#2-ai-generation-apis)
3. [Plan Management APIs](#3-plan-management-apis)
4. [Health & Status APIs](#4-health--status-apis)
5. [Data Models](#5-data-models)
6. [Error Handling](#6-error-handling)
7. [Rate Limiting](#7-rate-limiting)
8. [SDKs and Examples](#8-sdks-and-examples)

---

## 1. Authentication

### 1.1 Authentication Methods

**Anonymous Authentication (Current):**
- No API key required for public endpoints
- User data stored locally in browser
- Future: Firebase Auth integration

**Future Authentication:**
```http
Authorization: Bearer <firebase_id_token>
```

### 1.2 Public Endpoints
All current endpoints are public and require no authentication.

---

## 2. AI Generation APIs

### 2.1 Generate Marketing Plan Suggestions

**Endpoint:** `POST /api/ai/generate-marketing-plan`

**Description:** Generates AI-powered marketing plan suggestions based on business description.

**Request:**
```http
POST /api/ai/generate-marketing-plan
Content-Type: application/json

{
  "businessDescription": "string (50-2000 chars)"
}
```

**Request Schema:**
```typescript
interface GenerateMarketingPlanRequest {
  businessDescription: string; // min: 50, max: 2000 characters
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "situationAnalysis": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "opportunities": ["string"],
    "threats": ["string"],
    "competitors": [
      {
        "name": "string",
        "analysis": "string"
      }
    ]
  },
  "marketsAndCustomers": {
    "targetMarkets": ["string"],
    "customerPersonas": [
      {
        "name": "string",
        "description": "string"
      }
    ]
  },
  "stp": {
    "segmentation": ["string"],
    "targeting": "string",
    "positioning": "string"
  },
  "directionAndObjectives": {
    "missionStatement": "string",
    "visionStatement": "string",
    "objectives": [
      {
        "objective": "string",
        "kpi": "string"
      }
    ]
  },
  "strategiesAndPrograms": {
    "marketingMix": {
      "product": ["string"],
      "price": ["string"],
      "place": ["string"],
      "promotion": ["string"]
    },
    "aidaCopy": {
      "attention": "string",
      "interest": "string",
      "desire": "string",
      "action": "string"
    }
  },
  "metricsAndControl": {
    "kpis": ["string"],
    "controlProcesses": ["string"]
  }
}
```

**Error Responses:**
```http
HTTP/1.1 400 Bad Request
{
  "error": "Business description must be at least 50 characters",
  "code": "INVALID_INPUT"
}

HTTP/1.1 429 Too Many Requests
{
  "error": "Rate limit exceeded. Try again in 60 seconds.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 60
}

HTTP/1.1 503 Service Unavailable
{
  "error": "AI service temporarily unavailable",
  "code": "AI_SERVICE_ERROR"
}
```

**Example Request:**
```javascript
const response = await fetch('/api/ai/generate-marketing-plan', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    businessDescription: 'A boutique coffee shop in Portland, Oregon, specializing in single-origin, fair-trade beans. We serve local coffee enthusiasts and small cafes.'
  })
});

const marketingPlan = await response.json();
```

### 2.2 AI Service Health Check

**Endpoint:** `POST /api/ai/health`

**Description:** Checks AI service availability and response time.

**Request:**
```http
POST /api/ai/health
Content-Type: application/json

{
  "test": true
}
```

**Response:**
```http
HTTP/1.1 200 OK
{
  "status": "healthy",
  "aiService": "operational",
  "responseTime": 1250,
  "timestamp": "2024-12-01T10:30:00Z"
}
```

---

## 3. Plan Management APIs

### 3.1 Save Marketing Plan (Future)

**Endpoint:** `POST /api/plans`

**Description:** Saves a marketing plan to user's account.

**Request:**
```http
POST /api/plans
Authorization: Bearer <token>
Content-Type: application/json

{
  "businessDescription": "string",
  "situationAnalysis": { /* ... */ },
  "marketsAndCustomers": { /* ... */ },
  // ... other sections
}
```

**Response:**
```http
HTTP/1.1 201 Created
{
  "id": "plan_abc123",
  "userId": "user_xyz789",
  "createdAt": "2024-12-01T10:30:00Z",
  "updatedAt": "2024-12-01T10:30:00Z"
}
```

### 3.2 Get Marketing Plan (Future)

**Endpoint:** `GET /api/plans/{planId}`

**Description:** Retrieves a specific marketing plan.

**Request:**
```http
GET /api/plans/plan_abc123
Authorization: Bearer <token>
```

**Response:**
```http
HTTP/1.1 200 OK
{
  "id": "plan_abc123",
  "userId": "user_xyz789",
  "businessDescription": "string",
  "situationAnalysis": { /* ... */ },
  // ... complete plan data
  "createdAt": "2024-12-01T10:30:00Z",
  "updatedAt": "2024-12-01T10:30:00Z"
}
```

### 3.3 List Marketing Plans (Future)

**Endpoint:** `GET /api/plans`

**Description:** Lists all marketing plans for authenticated user.

**Request:**
```http
GET /api/plans?limit=10&offset=0
Authorization: Bearer <token>
```

**Response:**
```http
HTTP/1.1 200 OK
{
  "plans": [
    {
      "id": "plan_abc123",
      "businessDescription": "Coffee shop in Portland...",
      "createdAt": "2024-12-01T10:30:00Z",
      "updatedAt": "2024-12-01T10:30:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

---

## 4. Health & Status APIs

### 4.1 Application Health Check

**Endpoint:** `GET /api/health`

**Description:** Returns application health status.

**Request:**
```http
GET /api/health
```

**Response:**
```http
HTTP/1.1 200 OK
{
  "status": "healthy",
  "timestamp": "2024-12-01T10:30:00Z",
  "version": "1.0.0",
  "environment": "production",
  "uptime": 86400,
  "services": {
    "database": "healthy",
    "ai": "healthy"
  }
}
```

### 4.2 System Status

**Endpoint:** `GET /api/status`

**Description:** Detailed system status information.

**Request:**
```http
GET /api/status
```

**Response:**
```http
HTTP/1.1 200 OK
{
  "status": "operational",
  "components": [
    {
      "name": "Web Application",
      "status": "operational",
      "responseTime": 250
    },
    {
      "name": "AI Service",
      "status": "operational", 
      "responseTime": 1200
    },
    {
      "name": "Database",
      "status": "operational",
      "responseTime": 50
    }
  ],
  "incidents": [],
  "lastUpdated": "2024-12-01T10:30:00Z"
}
```

---

## 5. Data Models

### 5.1 Marketing Plan Schema

```typescript
interface MarketingPlan {
  id?: string;
  userId?: string;
  businessDescription: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  situationAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
    competitors: Array<{
      name: string;
      analysis: string;
    }>;
  };
  
  marketsAndCustomers?: {
    targetMarkets: string[];
    customerPersonas: Array<{
      name: string;
      description: string;
    }>;
  };
  
  stp?: {
    segmentation: string[];
    targeting: string;
    positioning: string;
  };
  
  directionAndObjectives?: {
    missionStatement: string;
    visionStatement: string;
    objectives: Array<{
      objective: string;
      kpi: string;
    }>;
  };
  
  strategiesAndPrograms?: {
    marketingMix: {
      product: string[];
      price: string[];
      place: string[];
      promotion: string[];
    };
    aidaCopy: {
      attention: string;
      interest: string;
      desire: string;
      action: string;
    };
  };
  
  metricsAndControl?: {
    kpis: string[];
    controlProcesses: string[];
  };
}
```

### 5.2 Error Response Schema

```typescript
interface ErrorResponse {
  error: string;           // Human-readable error message
  code: string;           // Machine-readable error code
  details?: any;          // Additional error details
  timestamp?: string;     // ISO 8601 timestamp
  traceId?: string;       // Request trace ID for debugging
}
```

### 5.3 API Response Schema

```typescript
interface APIResponse<T> {
  data?: T;               // Response data
  error?: ErrorResponse;  // Error information
  meta?: {                // Response metadata
    requestId: string;
    processingTime: number;
    version: string;
  };
}
```

---

## 6. Error Handling

### 6.1 HTTP Status Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Service temporarily down |

### 6.2 Error Codes

| Error Code | Description | Action |
|------------|-------------|---------|
| `INVALID_INPUT` | Request validation failed | Check request format |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait and retry |
| `AI_SERVICE_ERROR` | AI service unavailable | Retry or use manual input |
| `AUTHENTICATION_REQUIRED` | Missing authentication | Provide valid token |
| `INSUFFICIENT_PERMISSIONS` | Access denied | Check user permissions |
| `RESOURCE_NOT_FOUND` | Resource doesn't exist | Verify resource ID |
| `SERVICE_UNAVAILABLE` | Service temporarily down | Check status page |

### 6.3 Error Handling Examples

```javascript
// Handle API errors
async function generateMarketingPlan(businessDescription) {
  try {
    const response = await fetch('/api/ai/generate-marketing-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessDescription })
    });

    if (!response.ok) {
      const error = await response.json();
      
      switch (error.code) {
        case 'RATE_LIMIT_EXCEEDED':
          throw new Error(`Rate limit exceeded. Try again in ${error.retryAfter} seconds.`);
        case 'AI_SERVICE_ERROR':
          throw new Error('AI service is temporarily unavailable. Please try again later.');
        case 'INVALID_INPUT':
          throw new Error(error.error);
        default:
          throw new Error('An unexpected error occurred.');
      }
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

---

## 7. Rate Limiting

### 7.1 Rate Limits

| Endpoint | Limit | Window | Scope |
|----------|-------|---------|-------|
| `/api/ai/generate-marketing-plan` | 10 requests | 1 hour | Per IP |
| `/api/health` | 100 requests | 1 minute | Per IP |
| `/api/plans/*` | 100 requests | 1 hour | Per user |

### 7.2 Rate Limit Headers

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1672531200
X-RateLimit-Window: 3600
```

### 7.3 Rate Limit Handling

```javascript
// Check rate limit headers
function checkRateLimit(response) {
  const remaining = parseInt(response.headers.get('X-RateLimit-Remaining'));
  const reset = parseInt(response.headers.get('X-RateLimit-Reset'));
  
  if (remaining < 3) {
    const resetTime = new Date(reset * 1000);
    console.warn(`Approaching rate limit. Resets at ${resetTime}`);
  }
}

// Exponential backoff for rate limited requests
async function requestWithBackoff(url, options, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After')) || 60;
      const delay = Math.min(retryAfter * 1000, Math.pow(2, attempt) * 1000);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
    }
    
    return response;
  }
}
```

---

## 8. SDKs and Examples

### 8.1 JavaScript/TypeScript SDK

```typescript
// MarketPlanAI SDK
class MarketPlanAIClient {
  private baseURL: string;
  
  constructor(baseURL = 'https://marketplan-ai.com/api') {
    this.baseURL = baseURL;
  }
  
  async generateMarketingPlan(businessDescription: string): Promise<MarketingPlan> {
    const response = await fetch(`${this.baseURL}/ai/generate-marketing-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessDescription })
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }
  
  async checkHealth(): Promise<HealthStatus> {
    const response = await fetch(`${this.baseURL}/health`);
    return response.json();
  }
}

// Usage example
const client = new MarketPlanAIClient();

try {
  const plan = await client.generateMarketingPlan(
    'A sustainable fashion brand targeting eco-conscious millennials'
  );
  console.log('Generated plan:', plan);
} catch (error) {
  console.error('Error:', error);
}
```

### 8.2 React Hook

```typescript
// Custom React hook for MarketPlanAI
import { useState, useCallback } from 'react';

interface UseMarketingPlanAI {
  generatePlan: (description: string) => Promise<void>;
  plan: MarketingPlan | null;
  loading: boolean;
  error: string | null;
}

export function useMarketingPlanAI(): UseMarketingPlanAI {
  const [plan, setPlan] = useState<MarketingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = useCallback(async (businessDescription: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-marketing-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessDescription })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate plan');
      }

      const generatedPlan = await response.json();
      setPlan(generatedPlan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { generatePlan, plan, loading, error };
}

// Usage in component
function MarketingPlanGenerator() {
  const { generatePlan, plan, loading, error } = useMarketingPlanAI();
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generatePlan(description);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your business..."
        minLength={50}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Plan'}
      </button>
      {error && <div className="error">{error}</div>}
      {plan && <div className="plan">{/* Render plan */}</div>}
    </form>
  );
}
```

### 8.3 Python Example

```python
import requests
import json
from typing import Optional, Dict, Any

class MarketPlanAIClient:
    def __init__(self, base_url: str = "https://marketplan-ai.com/api"):
        self.base_url = base_url
        
    def generate_marketing_plan(self, business_description: str) -> Dict[str, Any]:
        """Generate a marketing plan using AI."""
        url = f"{self.base_url}/ai/generate-marketing-plan"
        
        payload = {
            "businessDescription": business_description
        }
        
        response = requests.post(
            url,
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 429:
            raise Exception("Rate limit exceeded. Please try again later.")
        elif response.status_code == 503:
            raise Exception("AI service temporarily unavailable.")
        elif not response.ok:
            error_data = response.json()
            raise Exception(f"API Error: {error_data.get('error', 'Unknown error')}")
        
        return response.json()
    
    def check_health(self) -> Dict[str, Any]:
        """Check API health status."""
        response = requests.get(f"{self.base_url}/health")
        return response.json()

# Usage example
client = MarketPlanAIClient()

try:
    plan = client.generate_marketing_plan(
        "A local bakery specializing in organic bread and pastries"
    )
    print("Generated marketing plan:", json.dumps(plan, indent=2))
except Exception as e:
    print(f"Error: {e}")
```

### 8.4 cURL Examples

```bash
# Generate marketing plan
curl -X POST https://marketplan-ai.com/api/ai/generate-marketing-plan \
  -H "Content-Type: application/json" \
  -d '{
    "businessDescription": "A tech startup developing mobile apps for small businesses"
  }'

# Check health
curl https://marketplan-ai.com/api/health

# Check AI service health
curl -X POST https://marketplan-ai.com/api/ai/health \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

---

## API Changelog

### Version 1.0.0 (Current)
- Initial API release
- AI marketing plan generation
- Health check endpoints
- Rate limiting implementation

### Planned Features (v1.1.0)
- User authentication with Firebase Auth
- Plan persistence and management
- Plan sharing capabilities
- Enhanced error reporting
- Webhook support for integrations

---

*For additional support and updates, visit: https://marketplan-ai.com/docs* 