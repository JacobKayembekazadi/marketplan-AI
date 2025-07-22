# MarketPlanAI - Technical Specification

**Version:** 1.0  
**Date:** December 2024  
**Technical Lead:** [Technical Lead Name]  
**Architecture:** Based on architectural_document.md  

---

## 1. System Overview

### 1.1 Technology Stack
```
Frontend: Next.js 15.3.3 + TypeScript + Tailwind CSS + Radix UI
Backend: Next.js Server Actions + Google Genkit
AI: Google Gemini 2.0 Flash
Database: Firebase Firestore (prepared)
Authentication: Firebase Auth (prepared)
Hosting: Firebase App Hosting
```

### 1.2 System Architecture
```
┌─────────────────┬─────────────────┬─────────────────┐
│   Presentation  │    Business     │      Data       │
│      Layer      │     Logic       │      Layer      │
├─────────────────┼─────────────────┼─────────────────┤
│ • Next.js Pages │ • Server Actions│ • Firebase      │
│ • React Components│ • Genkit Flows │ • Local State   │
│ • Tailwind CSS  │ • AI Integration│ • Zod Schemas   │
│ • Radix UI      │ • Validation    │ • Type Safety   │
└─────────────────┴─────────────────┴─────────────────┘
```

---

## 2. Data Models and Schemas

### 2.1 Core Data Schema
```typescript
// Primary data model for the entire marketing plan
interface MarketingPlan {
  id?: string;
  userId?: string;
  businessDescription: string;
  createdAt?: Date;
  updatedAt?: Date;
  completionStatus: {
    step1: boolean; // Situation Analysis
    step2: boolean; // Markets & Customers  
    step3: boolean; // STP
    step4: boolean; // Direction & Objectives
    step5: boolean; // Strategies & Programs
    step6: boolean; // Metrics & Control
  };
  
  situationAnalysis?: SituationAnalysis;
  marketsAndCustomers?: MarketsAndCustomers;
  stp?: STPStrategy;
  directionAndObjectives?: DirectionAndObjectives;
  strategiesAndPrograms?: StrategiesAndPrograms;
  metricsAndControl?: MetricsAndControl;
}

// Step 1: Situation Analysis
interface SituationAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  competitors: Competitor[];
}

interface Competitor {
  name: string;
  analysis: string;
  marketShare?: number;
  keyStrengths?: string[];
  keyWeaknesses?: string[];
}

// Step 2: Markets and Customers
interface MarketsAndCustomers {
  targetMarkets: string[];
  customerPersonas: CustomerPersona[];
  marketSize?: string;
  marketTrends?: string[];
}

interface CustomerPersona {
  name: string;
  description: string;
  demographics?: Demographics;
  psychographics?: Psychographics;
  painPoints?: string[];
  preferredChannels?: string[];
}

interface Demographics {
  ageRange: string;
  income: string;
  location: string;
  education: string;
  occupation: string;
}

interface Psychographics {
  values: string[];
  interests: string[];
  lifestyle: string;
  personality: string[];
}

// Step 3: Segmentation, Targeting, Positioning
interface STPStrategy {
  segmentation: string[];
  targeting: string;
  positioning: string;
  valueProposition?: string;
  competitiveAdvantage?: string;
}

// Step 4: Direction and Objectives
interface DirectionAndObjectives {
  missionStatement: string;
  visionStatement: string;
  objectives: MarketingObjective[];
  coreValues?: string[];
}

interface MarketingObjective {
  objective: string;
  kpi: string;
  target: string;
  timeframe: string;
  priority: 'High' | 'Medium' | 'Low';
}

// Step 5: Strategies and Programs
interface StrategiesAndPrograms {
  marketingMix: MarketingMix;
  aidaCopy: AIDACopy;
  budget?: BudgetAllocation;
  timeline?: Timeline;
}

interface MarketingMix {
  product: string[];
  price: string[];
  place: string[];
  promotion: string[];
}

interface AIDACopy {
  attention: string;
  interest: string;
  desire: string;
  action: string;
}

interface BudgetAllocation {
  total: number;
  digital: number;
  traditional: number;
  events: number;
  other: number;
}

interface Timeline {
  phase1: string[];
  phase2: string[];
  phase3: string[];
  milestones: Milestone[];
}

interface Milestone {
  name: string;
  date: Date;
  description: string;
}

// Step 6: Metrics and Control
interface MetricsAndControl {
  kpis: KPI[];
  controlProcesses: string[];
  reviewSchedule?: ReviewSchedule;
  contingencyPlans?: string[];
}

interface KPI {
  name: string;
  description: string;
  target: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  owner: string;
}

interface ReviewSchedule {
  weekly: string[];
  monthly: string[];
  quarterly: string[];
  annual: string[];
}
```

### 2.2 AI Integration Schemas
```typescript
// Input schema for AI generation
const GenerateMarketingPlanInputSchema = z.object({
  businessDescription: z.string()
    .min(50, "Business description must be at least 50 characters")
    .max(2000, "Business description cannot exceed 2000 characters"),
  industry: z.string().optional(),
  targetAudience: z.string().optional(),
  businessStage: z.enum(['startup', 'growth', 'mature', 'pivot']).optional(),
  budget: z.enum(['<10k', '10k-50k', '50k-100k', '100k+']).optional()
});

// AI response validation schema
const AIResponseSchema = z.object({
  situationAnalysis: z.object({
    strengths: z.array(z.string()).min(2).max(10),
    weaknesses: z.array(z.string()).min(2).max(10),
    opportunities: z.array(z.string()).min(2).max(10),
    threats: z.array(z.string()).min(2).max(10),
    competitors: z.array(z.object({
      name: z.string(),
      analysis: z.string().min(50)
    })).max(5)
  }),
  // ... additional validation for all sections
});
```

---

## 3. API Specifications

### 3.1 Server Actions API
```typescript
// Marketing Plan Generation
export async function generateMarketingPlanSuggestions(
  input: GenerateMarketingPlanSuggestionsInput
): Promise<GenerateMarketingPlanSuggestionsOutput> {
  // Validation
  const validatedInput = GenerateMarketingPlanInputSchema.parse(input);
  
  // AI Processing
  const result = await marketingPlanFlow(validatedInput);
  
  // Response validation
  return AIResponseSchema.parse(result);
}

// Plan persistence (when Firebase is integrated)
export async function savePlan(
  plan: MarketingPlan
): Promise<{ success: boolean; planId: string }> {
  // Authentication check
  // Data validation
  // Firestore write operation
  // Return result
}

export async function loadPlan(
  planId: string
): Promise<MarketingPlan | null> {
  // Authentication check
  // Firestore read operation
  // Data transformation
  // Return plan
}

export async function deletePlan(
  planId: string
): Promise<{ success: boolean }> {
  // Authentication check
  // Firestore delete operation
  // Return result
}
```

### 3.2 Client-Side State Management
```typescript
// React hooks for plan management
export function useMarketingPlan() {
  const [plan, setPlan] = useState<MarketingPlan>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async (businessDescription: string) => {
    setLoading(true);
    try {
      const suggestions = await generateMarketingPlanSuggestions({
        businessDescription
      });
      setPlan(suggestions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updatePlanSection = (section: keyof MarketingPlan, data: any) => {
    setPlan(prev => ({ ...prev, [section]: data }));
  };

  return { plan, loading, error, generateSuggestions, updatePlanSection };
}
```

---

## 4. AI Integration Implementation

### 4.1 Genkit Configuration
```typescript
// src/ai/genkit.ts
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
  telemetry: {
    instrumentation: 'googleai',
    logger: 'winston'
  }
});
```

### 4.2 AI Flow Implementation
```typescript
// Enhanced prompt for better AI responses
const marketingPlanPrompt = ai.definePrompt({
  name: 'comprehensiveMarketingPlan',
  input: { schema: GenerateMarketingPlanInputSchema },
  output: { schema: GenerateMarketingPlanOutputSchema },
  prompt: `
You are a senior marketing strategist with 15+ years of experience. 
Analyze the business description and create a comprehensive marketing plan.

Business Description: {{{businessDescription}}}

Guidelines:
1. SWOT Analysis: Provide 3-5 realistic items per category
2. Competitors: Research actual competitors when possible
3. Customer Personas: Create 2-3 detailed, realistic personas
4. STP: Use proven segmentation criteria
5. Objectives: Ensure SMART goal formatting
6. Marketing Mix: Provide actionable, specific strategies
7. AIDA Copy: Create compelling, brand-appropriate copy
8. KPIs: Select measurable, relevant metrics

Ensure all suggestions are:
- Industry-appropriate
- Actionable and specific
- Based on marketing best practices
- Realistic for the business size described
`
});

const marketingPlanFlow = ai.defineFlow({
  name: 'generateMarketingPlan',
  inputSchema: GenerateMarketingPlanInputSchema,
  outputSchema: GenerateMarketingPlanOutputSchema
}, async (input) => {
  try {
    const { output } = await marketingPlanPrompt(input);
    
    // Post-processing and validation
    const validatedOutput = validateAIOutput(output);
    
    // Log for monitoring
    console.log('AI Generation Success:', {
      businessLength: input.businessDescription.length,
      sectionsGenerated: Object.keys(validatedOutput).length
    });
    
    return validatedOutput;
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate marketing plan suggestions');
  }
});
```

### 4.3 Error Handling and Fallbacks
```typescript
// AI error handling with graceful degradation
export async function generateWithFallback(input: any) {
  const maxRetries = 3;
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await marketingPlanFlow(input);
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }
  }

  // Return partial/template response if AI fails
  return getTemplateResponse(input);
}

function getTemplateResponse(input: any): MarketingPlan {
  return {
    situationAnalysis: {
      strengths: ["Add your business strengths here"],
      weaknesses: ["Identify areas for improvement"],
      opportunities: ["Market opportunities to explore"],
      threats: ["Potential business threats"],
      competitors: []
    },
    // ... template structure for all sections
  };
}
```

---

## 5. Database Design

### 5.1 Firestore Collections Structure
```typescript
// Collection: users
interface User {
  uid: string;
  email?: string;
  displayName?: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  planCount: number;
  isAnonymous: boolean;
}

// Collection: marketing_plans
interface MarketingPlanDocument {
  id: string;
  userId: string;
  businessDescription: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completionStatus: CompletionStatus;
  data: MarketingPlan;
  version: number;
  isPublic: boolean;
  tags: string[];
}

// Collection: ai_generations
interface AIGenerationLog {
  id: string;
  userId: string;
  planId: string;
  inputTokens: number;
  outputTokens: number;
  processingTime: number;
  modelVersion: string;
  success: boolean;
  errorMessage?: string;
  timestamp: Timestamp;
}
```

### 5.2 Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Marketing plans are private to the user
    match /marketing_plans/{planId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // AI generation logs for analytics (read-only for users)
    match /ai_generations/{logId} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow write: if false; // Only server can write
    }
  }
}
```

---

## 6. Authentication & Security

### 6.1 Firebase Authentication Setup
```typescript
// Firebase Auth configuration
const authConfig = {
  providers: [
    'anonymous',
    'google.com',
    'email' // For future implementation
  ],
  signInOptions: {
    anonymous: true,
    google: {
      scopes: ['email', 'profile']
    }
  }
};

// Auth state management
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInAnonymously = () => auth.signInAnonymously();
  const signOut = () => auth.signOut();

  return { user, loading, signInAnonymously, signOut };
}
```

### 6.2 API Security Implementation
```typescript
// Server action authentication wrapper
export function withAuth<T extends any[], R>(
  action: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }

    return action(...args);
  };
}

// Rate limiting for AI calls
const rateLimiter = new Map<string, number[]>();

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];
  
  // Remove requests older than 1 hour
  const recentRequests = userRequests.filter(
    time => now - time < 3600000
  );
  
  // Allow max 10 AI generations per hour
  if (recentRequests.length >= 10) {
    return false;
  }

  recentRequests.push(now);
  rateLimiter.set(userId, recentRequests);
  return true;
}
```

---

## 7. Performance Optimization

### 7.1 Frontend Optimization
```typescript
// Code splitting for step components
const Step1 = dynamic(() => import('./steps/step1-situation-analysis'), {
  loading: () => <StepSkeleton />,
  ssr: false
});

// Memoization for expensive computations
const MemoizedPlanSummary = memo(({ plan }: { plan: MarketingPlan }) => {
  const summary = useMemo(() => generatePlanSummary(plan), [plan]);
  return <PlanSummary data={summary} />;
});

// Virtual scrolling for large lists
const VirtualizedCompetitorList = ({ competitors }: { competitors: Competitor[] }) => {
  return (
    <FixedSizeList
      height={400}
      itemCount={competitors.length}
      itemSize={80}
      itemData={competitors}
    >
      {CompetitorItem}
    </FixedSizeList>
  );
};
```

### 7.2 Caching Strategy
```typescript
// SWR for client-side caching
export function usePlan(planId: string) {
  return useSWR(
    planId ? `/api/plans/${planId}` : null,
    () => loadPlan(planId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000 // 1 minute
    }
  );
}

// Redis caching for AI responses (future implementation)
const cacheKey = `ai_suggestion_${hash(businessDescription)}`;
const cachedResult = await redis.get(cacheKey);

if (cachedResult) {
  return JSON.parse(cachedResult);
}

const aiResult = await generateAISuggestions(input);
await redis.setex(cacheKey, 3600, JSON.stringify(aiResult)); // 1 hour cache
```

---

## 8. Monitoring & Analytics

### 8.1 Application Monitoring
```typescript
// Error tracking setup
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.extra?.businessDescription) {
      delete event.extra.businessDescription;
    }
    return event;
  }
});

// Performance monitoring
export function trackUserAction(action: string, metadata?: any) {
  // Google Analytics 4
  gtag('event', action, {
    custom_parameter: metadata,
    page_location: window.location.href
  });

  // Custom analytics
  analytics.track(action, {
    ...metadata,
    timestamp: new Date().toISOString(),
    userId: getCurrentUser()?.uid
  });
}
```

### 8.2 AI Usage Analytics
```typescript
// Track AI generation metrics
export async function logAIGeneration(data: {
  userId: string;
  planId: string;
  inputLength: number;
  outputSections: string[];
  processingTime: number;
  success: boolean;
  error?: string;
}) {
  await db.collection('ai_generations').add({
    ...data,
    timestamp: Timestamp.now(),
    modelVersion: 'gemini-2.0-flash'
  });
}

// Usage analytics dashboard queries
export async function getAIUsageStats(timeframe: 'day' | 'week' | 'month') {
  const startDate = getStartDate(timeframe);
  
  return db.collection('ai_generations')
    .where('timestamp', '>=', startDate)
    .aggregate([
      { $group: { 
        _id: null, 
        totalGenerations: { $sum: 1 },
        successRate: { $avg: { $cond: ['$success', 1, 0] } },
        avgProcessingTime: { $avg: '$processingTime' }
      }}
    ]);
}
```

---

## 9. Deployment Configuration

### 9.1 Next.js Build Configuration
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'marketplanai.com']
    }
  },
  
  env: {
    GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID
  },

  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif']
  },

  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://marketplanai.com' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' }
      ]
    }
  ]
};
```

### 9.2 Firebase App Hosting Configuration
```yaml
# apphosting.yaml
runConfig:
  maxInstances: 5
  minInstances: 1
  concurrency: 100
  cpu: 1
  memoryMiB: 512
  
env:
  GOOGLE_AI_API_KEY:
    from_parameter: google_ai_api_key
  NODE_ENV: production
  
buildConfig:
  runtime: nodejs18
  commands:
    - npm ci --only=production
    - npm run build
```

---

## 10. API Rate Limits & Quotas

### 10.1 Google AI API Limits
```typescript
// Rate limiting configuration
const AI_RATE_LIMITS = {
  requestsPerMinute: 60,
  requestsPerDay: 1000,
  tokensPerRequest: 32000,
  concurrent: 5
};

// Quota management
export class AIQuotaManager {
  private usage = new Map<string, UsageStats>();

  async checkQuota(userId: string): Promise<boolean> {
    const stats = this.getOrCreateStats(userId);
    return stats.canMakeRequest();
  }

  async trackUsage(userId: string, tokens: number) {
    const stats = this.getOrCreateStats(userId);
    stats.recordUsage(tokens);
  }

  private getOrCreateStats(userId: string): UsageStats {
    if (!this.usage.has(userId)) {
      this.usage.set(userId, new UsageStats());
    }
    return this.usage.get(userId)!;
  }
}
```

---

## 11. Data Migration & Versioning

### 11.1 Schema Versioning
```typescript
// Data migration utilities
export async function migrateMarketingPlan(
  plan: any, 
  fromVersion: number, 
  toVersion: number
): Promise<MarketingPlan> {
  const migrations: Record<string, (data: any) => any> = {
    '1.0_to_1.1': (data) => ({
      ...data,
      version: '1.1',
      completionStatus: calculateCompletionStatus(data)
    }),
    
    '1.1_to_1.2': (data) => ({
      ...data,
      version: '1.2',
      strategiesAndPrograms: {
        ...data.strategiesAndPrograms,
        budget: data.budget || {}
      }
    })
  };

  let currentData = plan;
  let currentVersion = fromVersion;

  while (currentVersion < toVersion) {
    const nextVersion = getNextVersion(currentVersion);
    const migrationKey = `${currentVersion}_to_${nextVersion}`;
    
    if (migrations[migrationKey]) {
      currentData = migrations[migrationKey](currentData);
    }
    
    currentVersion = nextVersion;
  }

  return currentData;
}
```

---

*This technical specification provides the complete implementation details for the MarketPlanAI system, ensuring consistency between architecture, requirements, and implementation.* 