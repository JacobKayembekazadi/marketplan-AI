# MarketPlanAI - Development Workflow

**Version:** 1.0  
**Date:** December 2024  
**Team:** Development Team  
**Last Updated:** [Date]  

---

## 1. Development Environment Setup

### 1.1 Prerequisites
```bash
# Required software versions
Node.js >= 18.0.0
npm >= 9.0.0
Git >= 2.30.0
VS Code (recommended) or preferred IDE
Firebase CLI >= 12.0.0
```

### 1.2 Local Development Setup
```bash
# 1. Clone the repository
git clone https://github.com/your-org/marketplan-ai.git
cd marketplan-ai

# 2. Install dependencies
npm install

# 3. Environment configuration
cp .env.example .env.local
# Edit .env.local with your development keys:
# GOOGLE_AI_API_KEY=your_gemini_api_key
# FIREBASE_PROJECT_ID=your_firebase_project_id
# FIREBASE_API_KEY=your_firebase_api_key

# 4. Start development servers
npm run dev          # Next.js development server (port 9002)
npm run genkit:dev   # Genkit AI development server

# 5. Verify setup
curl http://localhost:9002/api/health
```

### 1.3 Development Tools Configuration

#### VS Code Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.eslint",
    "firebase.vscode-firebase-explorer",
    "ms-vscode.vscode-json"
  ]
}
```

#### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### ESLint Configuration
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "error"
  }
}
```

---

## 2. Git Workflow & Branching Strategy

### 2.1 Branch Structure
```
main                    # Production-ready code
├── develop            # Integration branch for features
├── feature/*          # Feature development branches
├── hotfix/*           # Critical production fixes
├── release/*          # Release preparation branches
└── docs/*             # Documentation updates
```

### 2.2 Branching Conventions
```bash
# Feature branches
feature/step1-swot-analysis
feature/ai-error-handling
feature/mobile-responsive-ui

# Bug fix branches
bugfix/ai-generation-timeout
bugfix/form-validation-errors

# Hotfix branches
hotfix/security-patch-auth
hotfix/critical-ai-api-issue

# Release branches
release/v1.0.0
release/v1.1.0-beta
```

### 2.3 Git Workflow Process

#### Starting a New Feature
```bash
# 1. Ensure you're on the latest develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Work on your feature with atomic commits
git add .
git commit -m "feat: implement SWOT analysis component"

# 4. Push regularly to backup work
git push -u origin feature/your-feature-name
```

#### Commit Message Convention
```bash
# Format: <type>(<scope>): <description>
feat(ui): add responsive sidebar navigation
fix(ai): handle Gemini API timeout errors
docs(readme): update setup instructions
style(components): fix Tailwind class ordering
refactor(hooks): optimize useMarketingPlan performance
test(api): add unit tests for plan generation
chore(deps): update Next.js to 15.3.3

# Breaking changes
feat(api)!: change plan data structure format
```

#### Pull Request Process
```bash
# 1. Ensure feature is complete and tested
npm run lint
npm run typecheck
npm run test

# 2. Rebase on latest develop
git checkout develop
git pull origin develop
git checkout feature/your-feature-name
git rebase develop

# 3. Push and create PR
git push origin feature/your-feature-name
# Create PR via GitHub/GitLab interface
```

---

## 3. Code Review Process

### 3.1 Pull Request Requirements

#### PR Checklist Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] AI generation tested (if applicable)

## Code Quality
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] No console.log statements left in code
- [ ] TypeScript types properly defined

## UI/UX (if applicable)
- [ ] Responsive design tested
- [ ] Accessibility guidelines followed
- [ ] Cross-browser testing completed
- [ ] Mobile testing completed

## Security
- [ ] No sensitive data exposed
- [ ] Input validation implemented
- [ ] Authentication/authorization properly handled
```

### 3.2 Code Review Guidelines

#### Reviewer Responsibilities
```markdown
## Review Focus Areas

### 1. Functionality
- Does the code solve the intended problem?
- Are edge cases handled?
- Is error handling comprehensive?

### 2. Code Quality
- Is the code readable and maintainable?
- Are functions/components properly sized?
- Is the code DRY (Don't Repeat Yourself)?

### 3. Performance
- Are there any performance bottlenecks?
- Is state management efficient?
- Are API calls optimized?

### 4. Security
- Is user input properly validated?
- Are authentication checks in place?
- Is sensitive data properly protected?

### 5. Testing
- Are unit tests comprehensive?
- Do tests cover edge cases?
- Is test coverage adequate (>80%)?
```

#### Review Response Times
- **Critical fixes:** 2 hours
- **Bug fixes:** 4 hours  
- **Features:** 24 hours
- **Documentation:** 48 hours

---

## 4. Testing Strategy

### 4.1 Testing Pyramid
```
                    /\
                   /  \
                  / E2E \ (10%)
                 /______\
                /        \
               / Integration\ (20%)
              /______________\
             /                \
            /   Unit Tests     \ (70%)
           /____________________\
```

### 4.2 Testing Framework Setup
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev cypress @cypress/react
npm install --save-dev @storybook/react

# Test scripts
npm run test              # Run unit tests
npm run test:watch        # Watch mode for development
npm run test:coverage     # Generate coverage report
npm run e2e               # Run Cypress E2E tests
npm run e2e:open          # Open Cypress GUI
```

### 4.3 Unit Testing Examples
```typescript
// __tests__/components/marketing-plan-builder.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MarketingPlanBuilder from '@/components/marketing-plan-builder';

describe('MarketingPlanBuilder', () => {
  test('renders initial business description form', () => {
    render(<MarketingPlanBuilder />);
    
    expect(screen.getByPlaceholderText(/describe your business/i)).toBeInTheDocument();
    expect(screen.getByText(/generate ai suggestions/i)).toBeInTheDocument();
  });

  test('generates AI suggestions when form is submitted', async () => {
    render(<MarketingPlanBuilder />);
    
    const textarea = screen.getByPlaceholderText(/describe your business/i);
    const generateButton = screen.getByText(/generate ai suggestions/i);
    
    fireEvent.change(textarea, { 
      target: { value: 'A coffee shop in downtown Brooklyn serving artisanal coffee' }
    });
    fireEvent.click(generateButton);
    
    expect(screen.getByText(/generating.../i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/suggestions generated/i)).toBeInTheDocument();
    });
  });
});
```

### 4.4 Integration Testing
```typescript
// __tests__/integration/ai-generation.test.ts
import { generateMarketingPlanSuggestions } from '@/ai/flows/generate-marketing-plan-suggestions';

describe('AI Generation Integration', () => {
  test('generates complete marketing plan from business description', async () => {
    const input = {
      businessDescription: 'A boutique fitness studio offering personal training and group classes'
    };

    const result = await generateMarketingPlanSuggestions(input);

    expect(result.situationAnalysis).toBeDefined();
    expect(result.situationAnalysis.strengths).toHaveLength.greaterThan(0);
    expect(result.marketsAndCustomers.targetMarkets).toHaveLength.greaterThan(0);
    expect(result.stp.positioning).toBeTruthy();
  }, 30000); // Extended timeout for AI calls
});
```

### 4.5 E2E Testing with Cypress
```typescript
// cypress/e2e/marketing-plan-creation.cy.ts
describe('Marketing Plan Creation Flow', () => {
  it('allows user to create a complete marketing plan', () => {
    cy.visit('/');
    
    // Enter business description
    cy.get('[data-testid="business-description"]')
      .type('A local bakery specializing in organic bread and pastries');
    
    // Generate AI suggestions
    cy.get('[data-testid="generate-suggestions"]').click();
    
    // Wait for AI generation
    cy.contains('Suggestions Generated', { timeout: 30000 });
    
    // Navigate through all steps
    cy.get('[data-testid="step-2"]').click();
    cy.contains('Markets & Customers');
    
    cy.get('[data-testid="step-3"]').click();
    cy.contains('STP');
    
    // Continue through all steps...
    
    // Verify plan completion
    cy.get('[data-testid="step-6"]').click();
    cy.contains('Metrics & Control');
    
    // Check export functionality
    cy.get('[data-testid="export-plan"]').should('be.visible');
  });
});
```

---

## 5. Continuous Integration/Continuous Deployment (CI/CD)

### 5.1 GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ develop, main ]
  pull_request:
    branches: [ develop, main ]

jobs:
  test:
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
    
    - name: Run linter
      run: npm run lint
    
    - name: Run type check
      run: npm run typecheck
    
    - name: Run unit tests
      run: npm run test -- --coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
    
    - name: Build application
      run: npm run build
      env:
        GOOGLE_AI_API_KEY: ${{ secrets.GOOGLE_AI_API_KEY }}

  e2e:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run E2E tests
      run: npm run e2e:ci
      env:
        CYPRESS_baseUrl: http://localhost:3000

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Firebase Hosting (Staging)
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_STAGING }}'
        projectId: marketplan-ai-staging
        channelId: live

  deploy-production:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Firebase Hosting (Production)
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_PROD }}'
        projectId: marketplan-ai-prod
        channelId: live
```

### 5.2 Environment Management
```bash
# Environment configurations
.env.local          # Local development
.env.staging        # Staging environment
.env.production     # Production environment

# Environment variables structure
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

GOOGLE_AI_API_KEY=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=

SENTRY_DSN=
GA_TRACKING_ID=

NODE_ENV=development|staging|production
```

---

## 6. Release Management

### 6.1 Semantic Versioning
```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes (2.0.0)
MINOR: New features, backward compatible (1.1.0)
PATCH: Bug fixes, backward compatible (1.0.1)

Pre-release: 1.0.0-alpha.1, 1.0.0-beta.1, 1.0.0-rc.1
```

### 6.2 Release Process
```bash
# 1. Create release branch
git checkout develop
git checkout -b release/v1.1.0

# 2. Update version and changelog
npm version minor  # Updates package.json
# Update CHANGELOG.md

# 3. Final testing and bug fixes
npm run test
npm run e2e
npm run build

# 4. Merge to main
git checkout main
git merge release/v1.1.0
git tag v1.1.0
git push origin main --tags

# 5. Merge back to develop
git checkout develop
git merge main
git push origin develop

# 6. Delete release branch
git branch -d release/v1.1.0
git push origin --delete release/v1.1.0
```

### 6.3 Hotfix Process
```bash
# 1. Create hotfix from main
git checkout main
git checkout -b hotfix/critical-auth-fix

# 2. Fix the issue
# ... make necessary changes ...

# 3. Test thoroughly
npm run test
npm run e2e:critical

# 4. Update version
npm version patch

# 5. Merge to main and develop
git checkout main
git merge hotfix/critical-auth-fix
git tag v1.0.1
git push origin main --tags

git checkout develop
git merge main
git push origin develop
```

---

## 7. Development Standards

### 7.1 Code Style Guidelines
```typescript
// Component structure
export default function ComponentName({ prop1, prop2 }: Props) {
  // 1. Hooks (useState, useEffect, custom hooks)
  const [state, setState] = useState<Type>(initialValue);
  const { data, loading } = useCustomHook();

  // 2. Computed values
  const computedValue = useMemo(() => {
    return expensiveComputation(data);
  }, [data]);

  // 3. Event handlers
  const handleClick = useCallback(() => {
    // Handler logic
  }, [dependencies]);

  // 4. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // 5. Early returns
  if (loading) return <LoadingSpinner />;
  if (!data) return <ErrorMessage />;

  // 6. Render
  return (
    <div className="component-wrapper">
      {/* Component JSX */}
    </div>
  );
}
```

### 7.2 File Organization
```
src/
├── app/                    # Next.js app router pages
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components (shadcn/ui)
│   ├── steps/             # Marketing plan step components
│   └── [component].tsx    # Feature-specific components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
├── ai/                     # AI integration (Genkit flows)
│   └── flows/             # AI flow definitions
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions

tests/
├── __tests__/             # Unit tests
├── integration/           # Integration tests
└── e2e/                   # End-to-end tests
```

### 7.3 Performance Guidelines
```typescript
// 1. Component optimization
const ExpensiveComponent = memo(({ data }: Props) => {
  const processedData = useMemo(() => processData(data), [data]);
  return <ComplexUI data={processedData} />;
});

// 2. Lazy loading
const LazyComponent = lazy(() => import('./HeavyComponent'));

// 3. Image optimization
import Image from 'next/image';
<Image
  src="/marketing-plan-preview.jpg"
  alt="Marketing Plan Preview"
  width={800}
  height={600}
  priority={isAboveFold}
/>

// 4. Bundle analysis
npm run analyze  # Custom script to analyze bundle size
```

---

## 8. Documentation Standards

### 8.1 Code Documentation
```typescript
/**
 * Generates AI-powered marketing plan suggestions based on business description
 * 
 * @param input - Business description and optional parameters
 * @param input.businessDescription - Detailed description of the business
 * @param input.industry - Optional industry category
 * @returns Promise resolving to complete marketing plan suggestions
 * 
 * @example
 * ```typescript
 * const suggestions = await generateMarketingPlanSuggestions({
 *   businessDescription: "A boutique coffee shop in downtown Seattle"
 * });
 * ```
 * 
 * @throws {Error} When business description is invalid or AI service fails
 */
export async function generateMarketingPlanSuggestions(
  input: GenerateMarketingPlanSuggestionsInput
): Promise<GenerateMarketingPlanSuggestionsOutput> {
  // Implementation
}
```

### 8.2 README Templates
```markdown
# Component Name

Brief description of the component's purpose.

## Usage

```tsx
import ComponentName from '@/components/ComponentName';

<ComponentName 
  prop1="value1"
  prop2={value2}
  onEvent={handleEvent}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| prop1 | string | Yes | - | Description of prop1 |
| prop2 | number | No | 0 | Description of prop2 |

## Examples

### Basic Usage
[Code example]

### Advanced Usage
[Code example]

## Testing

```bash
npm test ComponentName
```
```

---

## 9. Troubleshooting Guide

### 9.1 Common Development Issues

#### AI Generation Failures
```bash
# Check API key configuration
echo $GOOGLE_AI_API_KEY

# Test AI service directly
npm run genkit:dev
# Navigate to http://localhost:4000

# Check rate limits
curl -H "Authorization: Bearer $GOOGLE_AI_API_KEY" \
  https://generativelanguage.googleapis.com/v1/models
```

#### Build Failures
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run typecheck

# Check for missing dependencies
npm audit
```

#### Firebase Connection Issues
```bash
# Check Firebase configuration
firebase projects:list

# Test Firebase connection
firebase use your-project-id
firebase functions:shell

# Check Firestore rules
firebase firestore:rules:get
```

### 9.2 Performance Debugging
```bash
# Analyze bundle size
npm run build
npm run analyze

# Check for memory leaks
npm run dev
# Use Chrome DevTools -> Memory tab

# Profile performance
npm run build
npm start
# Use Chrome DevTools -> Performance tab
```

---

## 10. Team Communication

### 10.1 Daily Standup Format
```markdown
## What I completed yesterday:
- [Specific tasks/features completed]

## What I'm working on today:
- [Current tasks and priorities]

## Blockers/Challenges:
- [Any impediments or questions]

## Dependencies:
- [Waiting on others or external dependencies]
```

### 10.2 Sprint Planning
```markdown
## Sprint Goal:
[Overall objective for the sprint]

## Sprint Backlog:
### High Priority
- [ ] Task 1 (Story Points: 5)
- [ ] Task 2 (Story Points: 3)

### Medium Priority  
- [ ] Task 3 (Story Points: 8)
- [ ] Task 4 (Story Points: 2)

### Low Priority
- [ ] Task 5 (Story Points: 1)

## Definition of Done:
- Code review completed
- Unit tests written and passing
- Integration tests passing
- Documentation updated
- Deployed to staging
```

---

*This development workflow ensures consistent, high-quality development practices for the MarketPlanAI project while maintaining team collaboration and code quality standards.* 