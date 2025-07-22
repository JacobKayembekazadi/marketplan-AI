# MarketPlanAI - Operations Manual

**Version:** 1.0  
**Date:** December 2024  
**For:** Operations Team, Site Reliability Engineers  
**System:** MarketPlanAI Production Environment  

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Daily Operations](#2-daily-operations)
3. [Monitoring & Alerting](#3-monitoring--alerting)
4. [Performance Management](#4-performance-management)
5. [Incident Response](#5-incident-response)
6. [Maintenance Procedures](#6-maintenance-procedures)
7. [Backup & Recovery](#7-backup--recovery)
8. [Scaling Operations](#8-scaling-operations)
9. [Vendor Management](#9-vendor-management)
10. [Operational Procedures](#10-operational-procedures)

---

## 1. System Overview

### 1.1 Architecture Summary

**Primary Components:**
```
Production Environment:
├── Frontend: Next.js on Firebase App Hosting
├── AI Service: Google Genkit + Gemini 2.0 Flash
├── Database: Firebase Firestore (prepared)
├── Authentication: Firebase Auth (prepared)
├── Monitoring: Sentry + Firebase Performance
├── CDN: Firebase Hosting CDN
└── DNS: Cloudflare (or custom provider)
```

**Service Dependencies:**
- **Google AI API:** Critical for marketing plan generation
- **Firebase Services:** Core infrastructure platform
- **GitHub:** Source code repository and CI/CD
- **Sentry:** Error tracking and performance monitoring

### 1.2 Service Level Objectives (SLOs)

| Metric | Target | Measurement Window |
|--------|--------|-------------------|
| Uptime | 99.5% | Monthly |
| Response Time | < 3 seconds | 95th percentile |
| AI Generation | < 30 seconds | 90th percentile |
| Error Rate | < 1% | Daily |
| Availability | 99.9% | Business hours |

### 1.3 Critical Business Hours
- **Primary:** 6 AM - 10 PM PST (business hours in main markets)
- **Secondary:** 24/7 for global users
- **Peak Traffic:** 9 AM - 5 PM PST on weekdays

---

## 2. Daily Operations

### 2.1 Daily Checklist

**Morning Routine (8:00 AM PST):**
```bash
#!/bin/bash
# daily-health-check.sh

echo "🌅 Daily MarketPlanAI Health Check - $(date)"

# 1. System Health Check
echo "1. Checking system health..."
curl -f https://marketplan-ai.com/api/health || echo "❌ Health check failed"

# 2. AI Service Check
echo "2. Checking AI service..."
curl -f -X POST https://marketplan-ai.com/api/ai/health || echo "❌ AI service failed"

# 3. Performance Metrics
echo "3. Checking performance metrics..."
curl -f https://marketplan-ai.com/api/status || echo "❌ Status check failed"

# 4. Error Rate Check
echo "4. Checking error rates..."
# Query Sentry for last 24 hours error rate

# 5. Usage Statistics
echo "5. Daily usage statistics..."
echo "Active users last 24h: $(curl -s https://marketplan-ai.com/api/analytics/users/24h)"
echo "Plans generated: $(curl -s https://marketplan-ai.com/api/analytics/plans/24h)"
echo "AI generations: $(curl -s https://marketplan-ai.com/api/analytics/ai/24h)"

echo "✅ Daily health check completed"
```

**Midday Check (12:00 PM PST):**
- Review monitoring dashboards
- Check for any alerts or anomalies
- Verify AI quota consumption
- Monitor user feedback and support tickets

**Evening Review (6:00 PM PST):**
- Daily metrics summary
- Review any incidents from the day
- Plan next day's maintenance activities
- Update incident postmortems if needed

### 2.2 Weekly Operations

**Monday - Planning:**
- Review previous week's metrics
- Plan maintenance windows
- Update capacity forecasts
- Review security alerts

**Wednesday - Maintenance:**
- Apply non-critical updates
- Review and test backup procedures
- Conduct security scans
- Update documentation

**Friday - Review:**
- Weekly performance report
- Incident review and analysis
- Team retrospective
- Weekend coverage planning

### 2.3 Monthly Operations

**First Week:**
- Monthly performance review
- SLO compliance analysis
- Budget and cost optimization
- Vendor relationship review

**Second Week:**
- Disaster recovery testing
- Security audit and review
- Capacity planning update
- Documentation review

**Third Week:**
- System optimization initiatives
- Performance tuning
- User feedback analysis
- Feature usage analytics

**Fourth Week:**
- Monthly report generation
- Quarterly planning preparation
- Infrastructure cost analysis
- Risk assessment update

---

## 3. Monitoring & Alerting

### 3.1 Monitoring Stack

**Primary Monitoring Tools:**
```typescript
// Monitoring configuration
const monitoringConfig = {
  uptime: {
    tool: 'Firebase Monitoring',
    frequency: '30 seconds',
    endpoints: [
      'https://marketplan-ai.com',
      'https://marketplan-ai.com/api/health',
      'https://marketplan-ai.com/api/ai/health'
    ]
  },
  
  performance: {
    tool: 'Firebase Performance',
    metrics: ['page_load', 'api_response', 'ai_generation'],
    realTimeAlerts: true
  },
  
  errors: {
    tool: 'Sentry',
    errorThreshold: '10 errors/minute',
    performanceThreshold: '3 seconds 95th percentile'
  },
  
  infrastructure: {
    tool: 'Google Cloud Monitoring',
    metrics: ['cpu', 'memory', 'disk', 'network'],
    customMetrics: ['ai_quota_usage', 'rate_limit_hits']
  }
};
```

### 3.2 Alert Configuration

**Critical Alerts (Immediate Response Required):**
```yaml
critical_alerts:
  - name: "Service Down"
    condition: "uptime < 99%"
    notification: ["pagerduty", "sms", "email"]
    response_time: "5 minutes"
    
  - name: "AI Service Failure"
    condition: "ai_success_rate < 90%"
    notification: ["pagerduty", "slack"]
    response_time: "10 minutes"
    
  - name: "High Error Rate"
    condition: "error_rate > 5%"
    notification: ["pagerduty", "email"]
    response_time: "15 minutes"
    
  - name: "Performance Degradation"
    condition: "response_time > 10 seconds"
    notification: ["slack", "email"]
    response_time: "30 minutes"
```

**Warning Alerts (Monitor and Plan Response):**
```yaml
warning_alerts:
  - name: "Elevated Error Rate"
    condition: "error_rate > 2%"
    notification: ["slack"]
    
  - name: "Slow Response Time"
    condition: "response_time > 5 seconds"
    notification: ["slack"]
    
  - name: "AI Quota Warning"
    condition: "ai_quota_usage > 80%"
    notification: ["email", "slack"]
    
  - name: "High Traffic"
    condition: "requests_per_minute > 1000"
    notification: ["slack"]
```

### 3.3 Monitoring Dashboards

**Operations Dashboard:**
```markdown
# Real-time Operations Dashboard

## Service Health
- ✅ Application Status: Operational
- ✅ AI Service: Operational  
- ✅ Database: Operational
- ⚠️ CDN: Degraded Performance

## Key Metrics (Last 1 Hour)
- Requests: 2,450
- Success Rate: 99.2%
- Avg Response Time: 1.8s
- AI Generations: 145
- Active Users: 89

## Resource Utilization
- CPU: 45% average
- Memory: 62% average
- Storage: 23% used
- Bandwidth: 125 MB/hour
```

**Performance Dashboard:**
- Core Web Vitals tracking
- API endpoint performance
- AI generation success rates
- User experience metrics
- Geographic performance data

---

## 4. Performance Management

### 4.1 Performance Optimization

**Frontend Optimization:**
```bash
# Performance monitoring script
#!/bin/bash
# performance-check.sh

echo "📊 Performance Analysis - $(date)"

# 1. Lighthouse audit
echo "Running Lighthouse audit..."
lighthouse https://marketplan-ai.com --output=json --quiet > lighthouse-report.json

# 2. Core Web Vitals
echo "Core Web Vitals:"
echo "FCP: $(jq '.audits["first-contentful-paint"].numericValue' lighthouse-report.json)ms"
echo "LCP: $(jq '.audits["largest-contentful-paint"].numericValue' lighthouse-report.json)ms"
echo "CLS: $(jq '.audits["cumulative-layout-shift"].numericValue' lighthouse-report.json)"

# 3. Bundle analysis
echo "Bundle size analysis..."
npm run analyze > bundle-report.txt

# 4. AI performance
echo "AI service performance:"
curl -w "@performance-format.txt" -o /dev/null -s https://marketplan-ai.com/api/ai/health
```

**AI Service Optimization:**
```typescript
// AI performance monitoring
class AIPerformanceMonitor {
  static async trackGeneration(businessDescription: string) {
    const startTime = performance.now();
    
    try {
      const result = await generateMarketingPlan(businessDescription);
      const duration = performance.now() - startTime;
      
      await this.logMetrics({
        duration,
        success: true,
        inputLength: businessDescription.length,
        outputSections: Object.keys(result).length,
        timestamp: new Date()
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      await this.logMetrics({
        duration,
        success: false,
        error: error.message,
        inputLength: businessDescription.length,
        timestamp: new Date()
      });
      
      throw error;
    }
  }

  static async getPerformanceMetrics(timeframe: string) {
    // Query performance data from monitoring system
    return {
      averageResponseTime: await this.getAverageResponseTime(timeframe),
      successRate: await this.getSuccessRate(timeframe),
      totalGenerations: await this.getTotalGenerations(timeframe),
      peakConcurrency: await this.getPeakConcurrency(timeframe)
    };
  }
}
```

### 4.2 Capacity Planning

**Traffic Forecasting:**
```typescript
// Capacity planning calculations
class CapacityPlanner {
  static calculateRequirements(projectedUsers: number, growthRate: number) {
    const current = {
      users: 1000,
      requestsPerUser: 5,
      aiGenerationsPerUser: 0.8,
      peakTrafficMultiplier: 3
    };

    const projected = {
      users: projectedUsers,
      totalRequests: projectedUsers * current.requestsPerUser,
      aiGenerations: projectedUsers * current.aiGenerationsPerUser,
      peakRequests: projectedUsers * current.requestsPerUser * current.peakTrafficMultiplier
    };

    return {
      recommendedInstances: Math.ceil(projected.peakRequests / 100), // 100 req/instance
      aiQuotaNeeded: projected.aiGenerations * 1.5, // 50% buffer
      storageRequirement: projectedUsers * 0.1, // 0.1 MB per user
      bandwidthRequirement: projected.totalRequests * 0.5 // 0.5 MB per request
    };
  }

  static async generateCapacityReport() {
    const currentUsage = await this.getCurrentUsage();
    const projectedGrowth = await this.getGrowthProjections();
    
    return {
      current: currentUsage,
      projections: projectedGrowth,
      recommendations: this.calculateRequirements(
        projectedGrowth.usersIn3Months,
        projectedGrowth.monthlyGrowthRate
      )
    };
  }
}
```

---

## 5. Incident Response

### 5.1 Incident Classification

**Severity Levels:**
- **SEV1 (Critical):** Complete service outage, data loss
- **SEV2 (High):** Major feature broken, security issue
- **SEV3 (Medium):** Minor feature issue, performance degradation
- **SEV4 (Low):** Cosmetic issues, documentation updates

**Response Times:**
- **SEV1:** 15 minutes acknowledgment, 1 hour resolution target
- **SEV2:** 1 hour acknowledgment, 4 hours resolution target
- **SEV3:** 4 hours acknowledgment, 24 hours resolution target
- **SEV4:** 24 hours acknowledgment, 1 week resolution target

### 5.2 Incident Response Procedures

**SEV1 Incident Response:**
```bash
#!/bin/bash
# sev1-response.sh

echo "🚨 SEV1 INCIDENT RESPONSE INITIATED"

# 1. Immediate assessment
echo "1. Assessing impact..."
curl -f https://marketplan-ai.com/api/health > /dev/null
HEALTH_CHECK=$?

if [ $HEALTH_CHECK -ne 0 ]; then
    echo "❌ Primary service is down"
    
    # 2. Notify stakeholders
    echo "2. Notifying stakeholders..."
    # Send alerts to PagerDuty, Slack, Email
    
    # 3. Begin diagnosis
    echo "3. Starting diagnosis..."
    # Check Firebase status
    # Check AI service status
    # Check DNS resolution
    # Check CDN status
    
    # 4. Document incident
    echo "4. Creating incident record..."
    # Create incident in tracking system
    
    # 5. Start war room
    echo "5. Initiating incident war room..."
    # Create Slack channel or Zoom room
fi
```

**Common Incident Scenarios:**

1. **AI Service Outage:**
   ```markdown
   Symptoms: AI generations failing, 503 errors
   Investigation: Check Google AI API status, quota usage
   Mitigation: Enable degraded mode, display helpful error messages
   Resolution: Contact Google Support if needed
   ```

2. **High Response Times:**
   ```markdown
   Symptoms: Slow page loads, user complaints
   Investigation: Check Firebase hosting metrics, CDN performance
   Mitigation: Enable additional caching, scale instances
   Resolution: Optimize queries, upgrade infrastructure
   ```

3. **Database Issues:**
   ```markdown
   Symptoms: Data not saving, read errors
   Investigation: Check Firestore status, connection limits
   Mitigation: Implement retry logic, fallback to local storage
   Resolution: Optimize queries, increase limits
   ```

### 5.3 Incident Communication

**Internal Communication:**
```typescript
// Incident communication template
interface IncidentUpdate {
  severity: 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  impact: string;
  timeline: string;
  nextUpdate: string;
}

const incidentTemplate: IncidentUpdate = {
  severity: 'SEV1',
  title: 'AI Service Outage',
  status: 'investigating',
  impact: 'Users unable to generate marketing plans',
  timeline: 'Started at 14:30 PST, investigating root cause',
  nextUpdate: '15:30 PST or when status changes'
};
```

**External Communication:**
- Status page updates (status.marketplan-ai.com)
- Customer email notifications for major incidents
- Social media updates for widespread issues
- In-app notifications for service degradation

---

## 6. Maintenance Procedures

### 6.1 Scheduled Maintenance

**Weekly Maintenance Window:**
- **Time:** Sunday 2:00 AM - 4:00 AM PST
- **Duration:** 2 hours maximum
- **Frequency:** Weekly

**Maintenance Checklist:**
```bash
#!/bin/bash
# weekly-maintenance.sh

echo "🔧 Weekly Maintenance - $(date)"

# 1. System updates
echo "1. Checking for system updates..."
npm audit
npm update

# 2. Security scans
echo "2. Running security scans..."
npm audit --audit-level high

# 3. Database maintenance
echo "3. Database optimization..."
# Run Firestore maintenance queries
# Clean up old anonymous user data
# Optimize indexes

# 4. Performance optimization
echo "4. Performance optimization..."
# Clear CDN cache if needed
# Optimize images
# Update dependencies

# 5. Backup verification
echo "5. Verifying backups..."
# Test backup restore process
# Verify backup integrity

# 6. Documentation updates
echo "6. Updating documentation..."
# Update operational metrics
# Review and update runbooks

echo "✅ Weekly maintenance completed"
```

### 6.2 Emergency Maintenance

**Hotfix Deployment:**
```bash
#!/bin/bash
# emergency-hotfix.sh

echo "🚨 EMERGENCY HOTFIX DEPLOYMENT"

# 1. Validate hotfix
echo "1. Validating hotfix..."
npm test
npm run typecheck
npm run lint

# 2. Create hotfix branch
echo "2. Creating hotfix branch..."
git checkout -b hotfix/$(date +%Y%m%d-%H%M)

# 3. Deploy to staging
echo "3. Deploying to staging..."
firebase use staging
firebase deploy

# 4. Smoke test staging
echo "4. Testing staging deployment..."
curl -f https://marketplan-ai-staging.web.app/api/health

# 5. Deploy to production (with approval)
echo "5. Deploying to production..."
read -p "Deploy to production? (y/N): " confirm
if [ "$confirm" = "y" ]; then
    firebase use production
    firebase deploy
    echo "✅ Hotfix deployed to production"
else
    echo "❌ Production deployment cancelled"
fi
```

### 6.3 Rollback Procedures

**Automated Rollback:**
```bash
#!/bin/bash
# rollback.sh

echo "↩️ INITIATING ROLLBACK"

# 1. Get previous deployment
PREVIOUS_DEPLOYMENT=$(firebase hosting:deployments:list --limit 2 --json | jq -r '.[1].version')

echo "Rolling back to deployment: $PREVIOUS_DEPLOYMENT"

# 2. Perform rollback
firebase hosting:deployments:rollback $PREVIOUS_DEPLOYMENT

# 3. Verify rollback
sleep 30
curl -f https://marketplan-ai.com/api/health

if [ $? -eq 0 ]; then
    echo "✅ Rollback successful"
else
    echo "❌ Rollback failed - manual intervention required"
fi
```

---

## 7. Backup & Recovery

### 7.1 Backup Strategy

**Data Backup Schedule:**
```yaml
backup_schedule:
  firestore:
    frequency: "daily"
    time: "03:00 UTC"
    retention: "30 days"
    location: "gs://marketplan-ai-backups"
    
  application_code:
    frequency: "continuous"
    method: "git_repository"
    retention: "indefinite"
    
  configuration:
    frequency: "weekly"
    method: "manual_export"
    retention: "1 year"
    
  user_data:
    frequency: "daily"
    encryption: "required"
    retention: "5 years"
```

**Backup Verification:**
```bash
#!/bin/bash
# backup-verification.sh

echo "🔍 Backup Verification - $(date)"

# 1. Check Firestore backup
LATEST_BACKUP=$(gsutil ls gs://marketplan-ai-backups/ | tail -1)
echo "Latest backup: $LATEST_BACKUP"

# 2. Verify backup integrity
gsutil du -s $LATEST_BACKUP
BACKUP_SIZE=$(gsutil du -s $LATEST_BACKUP | awk '{print $1}')

if [ $BACKUP_SIZE -gt 1000000 ]; then
    echo "✅ Backup size acceptable: $BACKUP_SIZE bytes"
else
    echo "⚠️ Backup size seems small: $BACKUP_SIZE bytes"
fi

# 3. Test restore process (to staging)
echo "Testing restore process..."
# Restore backup to staging environment
# Verify data integrity

echo "✅ Backup verification completed"
```

### 7.2 Disaster Recovery

**Recovery Time Objectives (RTO):**
- **Critical Functions:** 4 hours
- **Full Service:** 24 hours
- **Historical Data:** 48 hours

**Recovery Point Objectives (RPO):**
- **User Data:** 24 hours (daily backups)
- **System Configuration:** 7 days (weekly backups)
- **Application Code:** Real-time (git repository)

**Disaster Recovery Plan:**
```markdown
# Disaster Recovery Procedures

## Total Service Outage
1. Assess scope and impact (15 minutes)
2. Activate incident response team (30 minutes)
3. Communicate with stakeholders (45 minutes)
4. Begin recovery procedures (1 hour)
5. Restore from backups if needed (2-4 hours)
6. Verify service functionality (30 minutes)
7. Resume normal operations

## Data Loss Scenario
1. Identify scope of data loss
2. Stop all write operations
3. Restore from latest backup
4. Validate data integrity
5. Resume operations with monitoring

## Infrastructure Failure
1. Switch to backup region/provider
2. Update DNS to point to backup
3. Restore application from backups
4. Sync any missing data
5. Monitor for stability
```

---

## 8. Scaling Operations

### 8.1 Auto-Scaling Configuration

**Firebase App Hosting Scaling:**
```yaml
# apphosting.yaml scaling configuration
runConfig:
  minInstances: 2
  maxInstances: 50
  concurrency: 100
  
autoScale:
  targetCpuUtilization: 70
  targetMemoryUtilization: 80
  cooldownPeriod: "300s"
  
scaling_triggers:
  - metric: "requests_per_second"
    threshold: 100
    scaleUp: 2
    scaleDown: 1
  
  - metric: "response_time_95th"
    threshold: 5000  # 5 seconds
    scaleUp: 3
    scaleDown: 0
```

**Manual Scaling Procedures:**
```bash
#!/bin/bash
# manual-scaling.sh

echo "📈 Manual Scaling Operations"

# Current usage
CURRENT_INSTANCES=$(gcloud app instances list --format="value(id)" | wc -l)
echo "Current instances: $CURRENT_INSTANCES"

# Traffic analysis
echo "Analyzing traffic patterns..."
REQUESTS_PER_MINUTE=$(curl -s https://marketplan-ai.com/api/metrics/rpm)
echo "Requests per minute: $REQUESTS_PER_MINUTE"

# Scaling decision
if [ $REQUESTS_PER_MINUTE -gt 500 ]; then
    echo "High traffic detected - scaling up"
    # Increase max instances
elif [ $REQUESTS_PER_MINUTE -lt 50 ]; then
    echo "Low traffic - scaling down"
    # Decrease instances
fi
```

### 8.2 Load Testing

**Regular Load Testing:**
```bash
#!/bin/bash
# load-test.sh

echo "🧪 Load Testing MarketPlanAI"

# 1. Baseline test
echo "Running baseline test..."
k6 run --vus 10 --duration 60s load-tests/baseline.js

# 2. AI generation load test
echo "Testing AI generation under load..."
k6 run --vus 5 --duration 300s load-tests/ai-generation.js

# 3. Spike test
echo "Running spike test..."
k6 run --vus 100 --duration 60s load-tests/spike.js

# 4. Generate report
echo "Generating load test report..."
k6 run --out json=results.json load-tests/comprehensive.js
```

---

## 9. Vendor Management

### 9.1 Critical Vendors

**Google Cloud/Firebase:**
- **SLA:** 99.95% uptime
- **Support:** Premium support plan
- **Contact:** Direct account manager
- **Escalation:** Critical issue hotline

**Google AI (Gemini):**
- **Quota:** 10,000 requests/day (can be increased)
- **Rate Limits:** 60 requests/minute
- **Support:** AI support forum + direct contact
- **Monitoring:** Built-in quota monitoring

### 9.2 Vendor Health Checks

**Daily Vendor Status:**
```bash
#!/bin/bash
# vendor-health.sh

echo "🏢 Vendor Health Check - $(date)"

# Firebase status
echo "Checking Firebase status..."
curl -s https://status.firebase.google.com/

# Google AI status
echo "Checking Google AI status..."
curl -s https://status.cloud.google.com/

# GitHub status
echo "Checking GitHub status..."
curl -s https://www.githubstatus.com/api/v2/status.json

echo "✅ Vendor health check completed"
```

---

## 10. Operational Procedures

### 10.1 Standard Operating Procedures

**User Support Escalation:**
```markdown
# User Support SOP

## Level 1: Self-Service
- User manual and FAQ
- In-app help and tooltips
- Community forum

## Level 2: Customer Support
- Email support (24-48 hour response)
- Chat support (business hours)
- Basic troubleshooting

## Level 3: Technical Support
- Complex technical issues
- Account/data problems
- Performance issues

## Level 4: Engineering Escalation
- System bugs
- Data loss incidents
- Security concerns
```

**Change Management:**
```markdown
# Change Management Process

## Low-Risk Changes
- Documentation updates
- Minor UI tweaks
- Configuration adjustments
- Approval: Team lead

## Medium-Risk Changes
- Feature updates
- Performance optimizations
- Third-party integrations
- Approval: Technical review + testing

## High-Risk Changes
- Architecture modifications
- Database schema changes
- Security updates
- Approval: Full team review + staging validation

## Emergency Changes
- Security hotfixes
- Critical bug fixes
- Service restoration
- Approval: Post-implementation review
```

### 10.2 Operational Metrics

**Daily Metrics Dashboard:**
```typescript
interface DailyMetrics {
  uptime: number;              // Percentage
  totalRequests: number;       // Count
  averageResponseTime: number; // Milliseconds
  errorRate: number;          // Percentage
  aiGenerations: number;      // Count
  activeUsers: number;        // Count
  newUserRegistrations: number; // Count
  supportTickets: number;     // Count
}

// Daily metrics collection
async function collectDailyMetrics(): Promise<DailyMetrics> {
  return {
    uptime: await getUptimePercentage(24), // Last 24 hours
    totalRequests: await getTotalRequests(24),
    averageResponseTime: await getAverageResponseTime(24),
    errorRate: await getErrorRate(24),
    aiGenerations: await getAIGenerationsCount(24),
    activeUsers: await getActiveUsersCount(24),
    newUserRegistrations: await getNewUsersCount(24),
    supportTickets: await getSupportTicketsCount(24)
  };
}
```

**Weekly Report Generation:**
```bash
#!/bin/bash
# weekly-report.sh

echo "📊 Weekly Operations Report"

# System performance
echo "## System Performance"
echo "Average uptime: $(curl -s https://marketplan-ai.com/api/metrics/uptime/weekly)%"
echo "Average response time: $(curl -s https://marketplan-ai.com/api/metrics/response-time/weekly)ms"
echo "Total AI generations: $(curl -s https://marketplan-ai.com/api/metrics/ai-generations/weekly)"

# User metrics
echo "## User Metrics"
echo "Weekly active users: $(curl -s https://marketplan-ai.com/api/metrics/wau)"
echo "New user registrations: $(curl -s https://marketplan-ai.com/api/metrics/new-users/weekly)"
echo "User retention rate: $(curl -s https://marketplan-ai.com/api/metrics/retention/weekly)%"

# Incident summary
echo "## Incidents"
echo "Total incidents: $(curl -s https://marketplan-ai.com/api/incidents/weekly/count)"
echo "Average resolution time: $(curl -s https://marketplan-ai.com/api/incidents/weekly/avg-resolution)"

# Generate full report
curl -s https://marketplan-ai.com/api/reports/weekly > weekly-report-$(date +%Y%m%d).json
```

---

## Emergency Contacts

### Internal Team
- **On-Call Engineer:** [Phone Number]
- **Technical Lead:** [Phone Number]
- **Operations Manager:** [Phone Number]
- **Security Team:** [Email/Phone]

### External Vendors
- **Firebase Support:** [Support Channel]
- **Google AI Support:** [Support Channel]
- **DNS Provider:** [Emergency Contact]
- **CDN Provider:** [Emergency Contact]

### Escalation Matrix
1. **Level 1:** On-call engineer (immediate)
2. **Level 2:** Technical lead (15 minutes)
3. **Level 3:** Operations manager (30 minutes)
4. **Level 4:** VP Engineering (1 hour)

---

## Quick Reference

### Common Commands
```bash
# Health checks
curl https://marketplan-ai.com/api/health
curl -X POST https://marketplan-ai.com/api/ai/health

# Deployment
firebase deploy --project production
firebase deploy --project staging

# Monitoring
firebase functions:log
gcloud logging read

# Rollback
firebase hosting:deployments:rollback DEPLOYMENT_ID
```

### Emergency Procedures
1. **Service Down:** Check Firebase status → Verify DNS → Check CDN → Escalate
2. **AI Issues:** Verify quota → Check API status → Test connectivity → Contact Google
3. **Performance Issues:** Check metrics → Scale instances → Optimize queries → Monitor

---

*This operations manual ensures reliable, efficient operation of MarketPlanAI with clear procedures for all operational scenarios.* 