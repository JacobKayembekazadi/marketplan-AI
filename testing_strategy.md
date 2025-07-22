# MarketPlanAI - Testing Strategy

**Version:** 1.0  
**Date:** December 2024  
**QA Lead:** [QA Lead Name]  
**Test Coverage Target:** 80%+  

---

## 1. Testing Overview

### 1.1 Testing Philosophy
Our testing strategy follows the **Testing Pyramid** approach, emphasizing:
- **Fast, reliable unit tests** (70% of test suite)
- **Focused integration tests** (20% of test suite)  
- **Critical path E2E tests** (10% of test suite)

### 1.2 Testing Objectives
- **Quality Assurance**: Ensure all features work as specified
- **Regression Prevention**: Catch bugs before they reach production
- **Performance Validation**: Verify system performance meets requirements
- **User Experience**: Validate complete user workflows
- **AI Reliability**: Ensure AI integrations are stable and accurate

### 1.3 Testing Scope
```
┌─────────────────────────────────────────────────────────┐
│                    TESTING SCOPE                        │
├─────────────────┬─────────────────┬─────────────────────┤
│   INCLUDED      │   PARTIALLY     │     EXCLUDED        │
│                 │   INCLUDED      │                     │
├─────────────────┼─────────────────┼─────────────────────┤
│ • Frontend UI   │ • AI API        │ • Third-party APIs  │
│ • User Flows    │   Responses     │ • Browser bugs      │
│ • State Mgmt    │ • Performance   │ • Network issues    │
│ • Form Logic    │   Benchmarks    │ • External services │
│ • Navigation    │ • Load Testing  │ • Infrastructure    │
│ • Data Persist  │ • Security      │                     │
└─────────────────┴─────────────────┴─────────────────────┘
```

---

## 2. Test Types and Framework Setup

### 2.1 Unit Testing Framework
```json
{
  "framework": "Jest",
  "renderer": "@testing-library/react",
  "utilities": [
    "@testing-library/jest-dom",
    "@testing-library/user-event",
    "jest-environment-jsdom"
  ],
  "coverage": {
    "threshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

#### Jest Configuration
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '<rootDir>/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

### 2.2 Integration Testing Setup
```bash
# Integration testing tools
npm install --save-dev supertest
npm install --save-dev @testing-library/react-hooks
npm install --save-dev msw  # Mock Service Worker
```

### 2.3 E2E Testing Framework
```json
{
  "framework": "Cypress",
  "plugins": [
    "@cypress/react",
    "cypress-axe",
    "cypress-real-events"
  ],
  "coverage": "cypress-coverage"
}
```

#### Cypress Configuration
```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
  },
  
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
});
```

---

## 3. Unit Testing Strategy

### 3.1 Component Testing Guidelines

#### Testing Checklist for Components
```typescript
// Component testing template
describe('ComponentName', () => {
  // ✅ Rendering tests
  test('renders without crashing', () => {});
  test('renders with required props', () => {});
  test('renders with optional props', () => {});
  
  // ✅ Interaction tests  
  test('handles user interactions correctly', () => {});
  test('calls event handlers with correct parameters', () => {});
  
  // ✅ State management tests
  test('updates state correctly', () => {});
  test('handles state edge cases', () => {});
  
  // ✅ Accessibility tests
  test('meets accessibility requirements', () => {});
  test('supports keyboard navigation', () => {});
  
  // ✅ Error handling tests
  test('handles error states gracefully', () => {});
  test('displays error messages appropriately', () => {});
});
```

#### Example: MarketingPlanBuilder Component Tests
```typescript
// __tests__/components/marketing-plan-builder.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MarketingPlanBuilder from '@/components/marketing-plan-builder';

// Mock AI generation
jest.mock('@/ai/flows/generate-marketing-plan-suggestions', () => ({
  generateMarketingPlanSuggestions: jest.fn(),
}));

const mockGenerateMarketingPlanSuggestions = require('@/ai/flows/generate-marketing-plan-suggestions')
  .generateMarketingPlanSuggestions as jest.Mock;

describe('MarketingPlanBuilder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    test('renders business description form', () => {
      render(<MarketingPlanBuilder />);
      
      expect(screen.getByLabelText(/business description/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /generate ai suggestions/i })).toBeInTheDocument();
      expect(screen.getByText(/step 1 of 6/i)).toBeInTheDocument();
    });

    test('shows correct initial step navigation', () => {
      render(<MarketingPlanBuilder />);
      
      expect(screen.getByText(/situation analysis/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
    });
  });

  describe('Business Description Input', () => {
    test('accepts and displays user input', async () => {
      const user = userEvent.setup();
      render(<MarketingPlanBuilder />);
      
      const textarea = screen.getByLabelText(/business description/i);
      const testDescription = 'A boutique coffee shop in Brooklyn';
      
      await user.type(textarea, testDescription);
      
      expect(textarea).toHaveValue(testDescription);
    });

    test('validates minimum length before AI generation', async () => {
      const user = userEvent.setup();
      render(<MarketingPlanBuilder />);
      
      const textarea = screen.getByLabelText(/business description/i);
      const generateButton = screen.getByRole('button', { name: /generate ai suggestions/i });
      
      await user.type(textarea, 'Too short');
      await user.click(generateButton);
      
      expect(screen.getByText(/business description is required/i)).toBeInTheDocument();
      expect(mockGenerateMarketingPlanSuggestions).not.toHaveBeenCalled();
    });
  });

  describe('AI Generation', () => {
    test('generates suggestions successfully', async () => {
      const user = userEvent.setup();
      const mockSuggestions = {
        situationAnalysis: {
          strengths: ['High-quality coffee'],
          weaknesses: ['Limited marketing budget'],
          opportunities: ['Growing coffee culture'],
          threats: ['Chain competition'],
          competitors: [{ name: 'Starbucks', analysis: 'Large chain competitor' }]
        },
        // ... other sections
      };

      mockGenerateMarketingPlanSuggestions.mockResolvedValue(mockSuggestions);
      
      render(<MarketingPlanBuilder />);
      
      const textarea = screen.getByLabelText(/business description/i);
      const generateButton = screen.getByRole('button', { name: /generate ai suggestions/i });
      
      await user.type(textarea, 'A boutique coffee shop specializing in single-origin beans');
      await user.click(generateButton);
      
      expect(screen.getByText(/generating.../i)).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.getByText(/suggestions generated/i)).toBeInTheDocument();
      });
      
      expect(mockGenerateMarketingPlanSuggestions).toHaveBeenCalledWith({
        businessDescription: 'A boutique coffee shop specializing in single-origin beans'
      });
    });

    test('handles AI generation errors gracefully', async () => {
      const user = userEvent.setup();
      mockGenerateMarketingPlanSuggestions.mockRejectedValue(new Error('AI service unavailable'));
      
      render(<MarketingPlanBuilder />);
      
      const textarea = screen.getByLabelText(/business description/i);
      const generateButton = screen.getByRole('button', { name: /generate ai suggestions/i });
      
      await user.type(textarea, 'A valid business description');
      await user.click(generateButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to generate suggestions/i)).toBeInTheDocument();
      });
    });
  });

  describe('Step Navigation', () => {
    test('navigates between steps correctly', async () => {
      const user = userEvent.setup();
      render(<MarketingPlanBuilder />);
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      
      await user.click(nextButton);
      
      expect(screen.getByText(/markets & customers/i)).toBeInTheDocument();
      expect(screen.getByText(/step 2 of 6/i)).toBeInTheDocument();
    });

    test('previous button works correctly', async () => {
      const user = userEvent.setup();
      render(<MarketingPlanBuilder />);
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      const prevButton = screen.getByRole('button', { name: /previous/i });
      
      await user.click(nextButton);
      await user.click(prevButton);
      
      expect(screen.getByText(/situation analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/step 1 of 6/i)).toBeInTheDocument();
    });

    test('disables navigation buttons at boundaries', () => {
      render(<MarketingPlanBuilder />);
      
      const prevButton = screen.getByRole('button', { name: /previous/i });
      expect(prevButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    test('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<MarketingPlanBuilder />);
      
      await user.tab();
      expect(screen.getByLabelText(/business description/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: /generate ai suggestions/i })).toHaveFocus();
    });

    test('provides proper ARIA labels', () => {
      render(<MarketingPlanBuilder />);
      
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('form')).toHaveAccessibleName();
      expect(screen.getByLabelText(/business description/i)).toBeInTheDocument();
    });
  });
});
```

### 3.2 Hook Testing Examples
```typescript
// __tests__/hooks/use-marketing-plan.test.ts
import { renderHook, act } from '@testing-library/react';
import { useMarketingPlan } from '@/hooks/use-marketing-plan';

describe('useMarketingPlan', () => {
  test('initializes with empty plan', () => {
    const { result } = renderHook(() => useMarketingPlan());
    
    expect(result.current.plan).toEqual({});
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('updates plan section correctly', () => {
    const { result } = renderHook(() => useMarketingPlan());
    
    act(() => {
      result.current.updatePlanSection('situationAnalysis', {
        strengths: ['Test strength'],
        weaknesses: [],
        opportunities: [],
        threats: [],
        competitors: []
      });
    });
    
    expect(result.current.plan.situationAnalysis?.strengths).toEqual(['Test strength']);
  });
});
```

### 3.3 Utility Function Testing
```typescript
// __tests__/lib/utils.test.ts
import { cn, formatPlanSummary, validateBusinessDescription } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    test('combines classes correctly', () => {
      expect(cn('base', 'additional')).toBe('base additional');
      expect(cn('base', undefined, 'additional')).toBe('base additional');
    });
  });

  describe('formatPlanSummary', () => {
    test('formats complete plan correctly', () => {
      const mockPlan = {
        situationAnalysis: { strengths: ['S1', 'S2'] },
        marketsAndCustomers: { targetMarkets: ['Market1'] }
      };
      
      const summary = formatPlanSummary(mockPlan);
      
      expect(summary).toContain('S1');
      expect(summary).toContain('Market1');
    });
  });

  describe('validateBusinessDescription', () => {
    test('accepts valid descriptions', () => {
      const validDescription = 'A well-established coffee shop serving artisanal coffee';
      expect(validateBusinessDescription(validDescription)).toBe(true);
    });

    test('rejects short descriptions', () => {
      expect(validateBusinessDescription('Too short')).toBe(false);
    });
  });
});
```

---

## 4. Integration Testing Strategy

### 4.1 API Integration Tests
```typescript
// __tests__/integration/ai-flows.test.ts
import { generateMarketingPlanSuggestions } from '@/ai/flows/generate-marketing-plan-suggestions';

describe('AI Integration Tests', () => {
  // Use longer timeout for AI calls
  jest.setTimeout(60000);

  test('generates valid marketing plan structure', async () => {
    const input = {
      businessDescription: 'A family-owned Italian restaurant in Chicago serving traditional cuisine'
    };

    const result = await generateMarketingPlanSuggestions(input);

    // Validate structure
    expect(result).toHaveProperty('situationAnalysis');
    expect(result).toHaveProperty('marketsAndCustomers');
    expect(result).toHaveProperty('stp');
    expect(result).toHaveProperty('directionAndObjectives');
    expect(result).toHaveProperty('strategiesAndPrograms');
    expect(result).toHaveProperty('metricsAndControl');

    // Validate content quality
    expect(result.situationAnalysis.strengths).toHaveLength.greaterThan(0);
    expect(result.stp.positioning).toBeTruthy();
    expect(result.strategiesAndPrograms.aidaCopy.attention).toBeTruthy();
  });

  test('handles AI service errors appropriately', async () => {
    const invalidInput = {
      businessDescription: '' // Invalid input
    };

    await expect(generateMarketingPlanSuggestions(invalidInput))
      .rejects
      .toThrow();
  });

  test('validates AI response schema', async () => {
    const input = {
      businessDescription: 'A tech startup developing mobile apps'
    };

    const result = await generateMarketingPlanSuggestions(input);

    // Schema validation
    expect(Array.isArray(result.situationAnalysis.strengths)).toBe(true);
    expect(Array.isArray(result.marketsAndCustomers.targetMarkets)).toBe(true);
    expect(typeof result.stp.positioning).toBe('string');
  });
});
```

### 4.2 Component Integration Tests
```typescript
// __tests__/integration/marketing-plan-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SWRConfig } from 'swr';
import MarketingPlanBuilder from '@/components/marketing-plan-builder';

// Mock external dependencies
jest.mock('@/ai/flows/generate-marketing-plan-suggestions');

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>
    {children}
  </SWRConfig>
);

describe('Marketing Plan Flow Integration', () => {
  test('complete user flow from description to plan completion', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <MarketingPlanBuilder />
      </TestWrapper>
    );

    // Step 1: Enter business description
    const textarea = screen.getByLabelText(/business description/i);
    await user.type(textarea, 'A sustainable fashion brand targeting eco-conscious millennials');

    // Step 2: Generate AI suggestions
    const generateButton = screen.getByRole('button', { name: /generate ai suggestions/i });
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText(/suggestions generated/i)).toBeInTheDocument();
    });

    // Step 3: Navigate through all steps
    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Step 2: Markets & Customers
    await user.click(nextButton);
    expect(screen.getByText(/markets & customers/i)).toBeInTheDocument();
    
    // Step 3: STP
    await user.click(nextButton);
    expect(screen.getByText(/segmentation, targeting/i)).toBeInTheDocument();
    
    // Continue through remaining steps...
    await user.click(nextButton); // Step 4
    await user.click(nextButton); // Step 5
    await user.click(nextButton); // Step 6
    
    expect(screen.getByText(/metrics & control/i)).toBeInTheDocument();
  });
});
```

### 4.3 State Management Integration Tests
```typescript
// __tests__/integration/state-persistence.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MarketingPlanBuilder from '@/components/marketing-plan-builder';

describe('State Persistence Integration', () => {
  test('preserves data when navigating between steps', async () => {
    const user = userEvent.setup();
    render(<MarketingPlanBuilder />);

    // Add data to Step 1
    const strengthInput = screen.getByPlaceholderText(/enter a strength/i);
    await user.type(strengthInput, 'Unique product design');

    // Navigate to Step 2
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    // Navigate back to Step 1
    const prevButton = screen.getByRole('button', { name: /previous/i });
    await user.click(prevButton);

    // Verify data persistence
    expect(screen.getByDisplayValue('Unique product design')).toBeInTheDocument();
  });
});
```

---

## 5. End-to-End Testing Strategy

### 5.1 Critical User Journeys
```typescript
// cypress/e2e/critical-paths.cy.ts
describe('Critical User Journeys', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe(); // Accessibility testing
  });

  it('completes full marketing plan creation workflow', () => {
    // Business description entry
    cy.get('[data-testid="business-description"]')
      .type('An organic grocery store in Portland focusing on locally-sourced produce');

    // AI generation
    cy.get('[data-testid="generate-suggestions"]').click();
    cy.contains('Suggestions Generated', { timeout: 30000 });

    // Step 1: Situation Analysis
    cy.get('[data-testid="add-strength"]').click();
    cy.get('[data-testid="strength-input-0"]')
      .type('Local supplier relationships');

    // Navigate to Step 2
    cy.get('[data-testid="next-step"]').click();
    cy.contains('Markets & Customers');

    // Step 2: Add target market
    cy.get('[data-testid="add-target-market"]').click();
    cy.get('[data-testid="target-market-0"]')
      .type('Health-conscious families');

    // Continue through all steps...
    for (let step = 3; step <= 6; step++) {
      cy.get('[data-testid="next-step"]').click();
      cy.contains(`Step ${step} of 6`);
    }

    // Verify completion
    cy.contains('Metrics & Control');
    cy.get('[data-testid="export-plan"]').should('be.visible');
    
    // Accessibility check
    cy.checkA11y();
  });

  it('handles AI generation failures gracefully', () => {
    // Mock AI failure
    cy.intercept('POST', '/api/ai/generate', { 
      statusCode: 500, 
      body: { error: 'AI service unavailable' } 
    });

    cy.get('[data-testid="business-description"]')
      .type('A test business description');
    
    cy.get('[data-testid="generate-suggestions"]').click();
    
    cy.contains('Failed to generate suggestions');
    cy.get('[data-testid="retry-generation"]').should('be.visible');
  });

  it('supports keyboard-only navigation', () => {
    // Tab through form elements
    cy.get('body').tab();
    cy.focused().should('have.attr', 'data-testid', 'business-description');

    cy.focused().type('Keyboard navigation test business');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'data-testid', 'generate-suggestions');

    // Continue keyboard navigation testing...
  });
});
```

### 5.2 Mobile Responsiveness Tests
```typescript
// cypress/e2e/mobile-responsive.cy.ts
describe('Mobile Responsiveness', () => {
  const viewports = [
    { device: 'iphone-x', width: 375, height: 812 },
    { device: 'samsung-s10', width: 360, height: 760 },
    { device: 'ipad-2', width: 768, height: 1024 }
  ];

  viewports.forEach(({ device, width, height }) => {
    it(`works correctly on ${device}`, () => {
      cy.viewport(width, height);
      cy.visit('/');

      // Test mobile navigation
      cy.get('[data-testid="mobile-menu-toggle"]').click();
      cy.get('[data-testid="sidebar-navigation"]').should('be.visible');

      // Test form interactions on mobile
      cy.get('[data-testid="business-description"]')
        .type('Mobile testing business description');
      
      cy.get('[data-testid="generate-suggestions"]').click();
      
      // Verify mobile-specific layout
      cy.get('[data-testid="step-progress"]').should('be.visible');
      cy.get('[data-testid="step-content"]').should('be.visible');
    });
  });
});
```

### 5.3 Performance Testing
```typescript
// cypress/e2e/performance.cy.ts
describe('Performance Tests', () => {
  it('loads initial page within acceptable time', () => {
    const start = performance.now();
    
    cy.visit('/');
    cy.get('[data-testid="marketing-plan-builder"]').should('be.visible');
    
    cy.then(() => {
      const loadTime = performance.now() - start;
      expect(loadTime).to.be.lessThan(3000); // 3 second target
    });
  });

  it('handles large form inputs efficiently', () => {
    cy.visit('/');
    
    const largeText = 'A'.repeat(2000); // 2000 character description
    
    cy.get('[data-testid="business-description"]').type(largeText, { delay: 0 });
    
    // Should remain responsive
    cy.get('[data-testid="generate-suggestions"]').should('not.be.disabled');
  });

  it('AI generation completes within timeout', () => {
    cy.visit('/');
    
    cy.get('[data-testid="business-description"]')
      .type('Performance test business description');
    
    const start = Date.now();
    cy.get('[data-testid="generate-suggestions"]').click();
    
    cy.contains('Suggestions Generated', { timeout: 30000 });
    
    cy.then(() => {
      const duration = Date.now() - start;
      expect(duration).to.be.lessThan(30000); // 30 second max
    });
  });
});
```

---

## 6. Testing Data Management

### 6.1 Test Data Strategy
```typescript
// __tests__/fixtures/test-data.ts
export const mockBusinessDescriptions = {
  coffeeShop: 'A boutique coffee shop in Brooklyn specializing in single-origin beans and artisanal pastries',
  techStartup: 'A SaaS platform helping small businesses manage their social media presence',
  restaurant: 'A family-owned Italian restaurant serving traditional recipes in downtown Chicago',
  ecommerce: 'An online sustainable fashion brand targeting eco-conscious millennials',
  consultancy: 'A marketing consultancy helping B2B companies improve their digital presence'
};

export const mockMarketingPlan = {
  complete: {
    situationAnalysis: {
      strengths: ['Unique product offering', 'Strong local reputation'],
      weaknesses: ['Limited marketing budget', 'Small team'],
      opportunities: ['Growing market demand', 'Digital expansion'],
      threats: ['Increased competition', 'Economic uncertainty'],
      competitors: [
        { name: 'Competitor A', analysis: 'Large chain with broad reach' },
        { name: 'Competitor B', analysis: 'Local competitor with similar offerings' }
      ]
    },
    marketsAndCustomers: {
      targetMarkets: ['Health-conscious consumers', 'Local professionals'],
      customerPersonas: [
        { name: 'Sarah', description: 'Working professional who values quality' },
        { name: 'Mike', description: 'Health-conscious father of two' }
      ]
    },
    // ... other sections
  },
  
  partial: {
    situationAnalysis: {
      strengths: ['Test strength'],
      weaknesses: [],
      opportunities: [],
      threats: [],
      competitors: []
    }
  }
};

export const mockAIResponses = {
  success: mockMarketingPlan.complete,
  
  error: {
    message: 'AI service temporarily unavailable',
    code: 'AI_SERVICE_ERROR'
  },
  
  timeout: {
    message: 'Request timeout',
    code: 'TIMEOUT_ERROR'
  }
};
```

### 6.2 Mock Service Worker Setup
```typescript
// __tests__/mocks/handlers.ts
import { rest } from 'msw';
import { mockAIResponses } from '../fixtures/test-data';

export const handlers = [
  // AI generation endpoint
  rest.post('/api/ai/generate', (req, res, ctx) => {
    const { businessDescription } = req.body as any;
    
    if (!businessDescription || businessDescription.length < 50) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Invalid business description' })
      );
    }
    
    // Simulate processing time
    return res(
      ctx.delay(2000),
      ctx.json(mockAIResponses.success)
    );
  }),

  // Plan persistence endpoints
  rest.post('/api/plans', (req, res, ctx) => {
    return res(
      ctx.json({ id: 'test-plan-id', success: true })
    );
  }),

  rest.get('/api/plans/:id', (req, res, ctx) => {
    return res(
      ctx.json(mockMarketingPlan.complete)
    );
  }),
];
```

### 6.3 Database Testing Setup
```typescript
// __tests__/setup/test-db.ts
import { initializeTestEnvironment } from '@firebase/rules-unit-testing';

export async function setupTestDatabase() {
  const testEnv = await initializeTestEnvironment({
    projectId: 'test-project',
    firestore: {
      rules: `rules_version = '2';
              service cloud.firestore {
                match /databases/{database}/documents {
                  match /{document=**} {
                    allow read, write: if true;
                  }
                }
              }`
    }
  });

  return testEnv;
}

export async function cleanupTestDatabase(testEnv: any) {
  await testEnv.cleanup();
}
```

---

## 7. Accessibility Testing

### 7.1 Automated Accessibility Testing
```typescript
// __tests__/accessibility/a11y.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import MarketingPlanBuilder from '@/components/marketing-plan-builder';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  test('MarketingPlanBuilder has no accessibility violations', async () => {
    const { container } = render(<MarketingPlanBuilder />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Form elements have proper labels', () => {
    render(<MarketingPlanBuilder />);
    
    expect(screen.getByLabelText(/business description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate ai suggestions/i })).toBeInTheDocument();
  });

  test('Navigation is keyboard accessible', async () => {
    const user = userEvent.setup();
    render(<MarketingPlanBuilder />);
    
    // Test tab navigation
    await user.tab();
    expect(screen.getByLabelText(/business description/i)).toHaveFocus();
    
    await user.tab();
    expect(screen.getByRole('button', { name: /generate ai suggestions/i })).toHaveFocus();
  });
});
```

### 7.2 Cypress Accessibility Tests
```typescript
// cypress/e2e/accessibility.cy.ts
describe('Accessibility E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('meets WCAG 2.1 AA standards', () => {
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'focus-management': { enabled: true }
      }
    });
  });

  it('supports screen reader navigation', () => {
    cy.get('[aria-label]').should('exist');
    cy.get('[role="main"]').should('exist');
    cy.get('h1, h2, h3').should('exist');
  });
});
```

---

## 8. Performance Testing

### 8.1 Load Testing Configuration
```javascript
// performance/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% of requests under 3s
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
  },
};

export default function () {
  // Test homepage load
  let response = http.get('https://marketplan-ai.com');
  check(response, {
    'homepage loads': (r) => r.status === 200,
    'load time acceptable': (r) => r.timings.duration < 3000,
  });

  sleep(1);

  // Test AI generation endpoint
  let aiResponse = http.post('https://marketplan-ai.com/api/ai/generate', {
    businessDescription: 'A test business for load testing purposes'
  });
  
  check(aiResponse, {
    'AI generation succeeds': (r) => r.status === 200,
    'AI response time acceptable': (r) => r.timings.duration < 30000,
  });

  sleep(2);
}
```

### 8.2 Bundle Size Testing
```javascript
// scripts/analyze-bundle.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const fs = require('fs');

function analyzeBundleSize() {
  const statsFile = '.next/analyze/client.json';
  
  if (!fs.existsSync(statsFile)) {
    console.error('Build stats not found. Run: npm run build:analyze');
    process.exit(1);
  }

  const stats = JSON.parse(fs.readFileSync(statsFile));
  const assets = stats.assets;
  
  const jsBundles = assets.filter(asset => asset.name.endsWith('.js'));
  const totalJSSize = jsBundles.reduce((total, bundle) => total + bundle.size, 0);
  
  const maxBundleSize = 250 * 1024; // 250KB limit
  const maxTotalSize = 1024 * 1024; // 1MB limit
  
  console.log(`Total JS bundle size: ${(totalJSSize / 1024).toFixed(2)}KB`);
  
  if (totalJSSize > maxTotalSize) {
    console.error(`Bundle size exceeds limit: ${(totalJSSize / 1024).toFixed(2)}KB > ${maxTotalSize / 1024}KB`);
    process.exit(1);
  }
  
  console.log('Bundle size check passed ✅');
}

analyzeBundleSize();
```

---

## 9. Test Automation and CI/CD Integration

### 9.1 GitHub Actions Test Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Start application
      run: npm start &
      
    - name: Wait for server
      run: npx wait-on http://localhost:3000
    
    - name: Run E2E tests
      run: npm run e2e:headless
    
    - name: Upload E2E artifacts
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: cypress-screenshots
        path: cypress/screenshots

  accessibility-tests:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run accessibility tests
      run: npm run test:a11y
    
    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli
        lhci autorun

  performance-tests:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run bundle analysis
      run: npm run analyze:bundle
    
    - name: Run load tests
      run: |
        npm install -g k6
        k6 run performance/load-test.js
```

### 9.2 Test Reporting and Metrics
```typescript
// scripts/test-reporter.ts
import fs from 'fs';
import path from 'path';

interface TestResults {
  unitTests: {
    passed: number;
    failed: number;
    coverage: number;
  };
  e2eTests: {
    passed: number;
    failed: number;
  };
  accessibility: {
    violations: number;
    warnings: number;
  };
}

export function generateTestReport(results: TestResults) {
  const report = `
# Test Report - ${new Date().toISOString()}

## Unit Tests
- ✅ Passed: ${results.unitTests.passed}
- ❌ Failed: ${results.unitTests.failed}
- 📊 Coverage: ${results.unitTests.coverage}%

## E2E Tests
- ✅ Passed: ${results.e2eTests.passed}
- ❌ Failed: ${results.e2eTests.failed}

## Accessibility
- 🚨 Violations: ${results.accessibility.violations}
- ⚠️ Warnings: ${results.accessibility.warnings}

## Overall Status
${getOverallStatus(results)}
`;

  fs.writeFileSync('test-report.md', report);
  console.log('Test report generated: test-report.md');
}

function getOverallStatus(results: TestResults): string {
  const hasFailures = results.unitTests.failed > 0 || 
                     results.e2eTests.failed > 0 || 
                     results.accessibility.violations > 0;
  
  return hasFailures ? '❌ FAILED' : '✅ PASSED';
}
```

---

## 10. Testing Best Practices and Guidelines

### 10.1 Writing Effective Tests
```typescript
// ✅ Good test example
describe('When user submits marketing plan form', () => {
  beforeEach(() => {
    render(<MarketingPlanForm onSubmit={mockSubmit} />);
  });

  test('should validate required fields before submission', async () => {
    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    await user.click(submitButton);
    
    expect(screen.getByText(/business description is required/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('should submit valid form data', async () => {
    const user = userEvent.setup();
    const businessInput = screen.getByLabelText(/business description/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    await user.type(businessInput, 'Valid business description');
    await user.click(submitButton);
    
    expect(mockSubmit).toHaveBeenCalledWith({
      businessDescription: 'Valid business description'
    });
  });
});

// ❌ Poor test example
test('form works', () => {
  render(<MarketingPlanForm />);
  // Too vague, doesn't test specific behavior
});
```

### 10.2 Test Organization Standards
```
__tests__/
├── components/           # Component-specific tests
│   ├── ui/              # UI component tests
│   └── steps/           # Step component tests
├── hooks/               # Custom hook tests
├── utils/               # Utility function tests
├── integration/         # Integration tests
├── accessibility/       # A11y tests
├── fixtures/           # Test data and mocks
├── mocks/              # Mock service workers
└── setup/              # Test configuration
```

### 10.3 Test Quality Checklist
```markdown
## Test Quality Checklist

### Unit Tests
- [ ] Tests have descriptive names that explain what they test
- [ ] Each test focuses on a single behavior
- [ ] Tests use AAA pattern (Arrange, Act, Assert)
- [ ] Mocks are used appropriately for external dependencies
- [ ] Edge cases and error conditions are tested
- [ ] Tests are fast (< 100ms per test)

### Integration Tests
- [ ] Tests cover complete user workflows
- [ ] External API calls are properly mocked
- [ ] Database interactions are tested with test data
- [ ] Error handling scenarios are covered

### E2E Tests
- [ ] Tests cover critical business flows
- [ ] Tests are stable and don't rely on timing
- [ ] Test data is properly managed and cleaned up
- [ ] Tests work across different browsers/devices
```

---

*This comprehensive testing strategy ensures MarketPlanAI maintains high quality, reliability, and user experience standards throughout development and production deployment.* 