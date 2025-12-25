---
description: Set up automated deployment pipeline
---

# setup-deployment

STEP 0: ACTIVATE COMPACT SUMMARY MODE
Before reading the full command, execute this script to display the compact summary:
```bash
sed -n '/<!-- COMPACT_SUMMARY_START -->/,/<!-- COMPACT_SUMMARY_END -->/p' "$(dirname "$0")/deploy.md" | grep -v "COMPACT_SUMMARY"
```
If the user confirms they want the full details, continue. Otherwise, stop here.

Automatically set up deployment pipeline for the project.

<!-- COMPACT_SUMMARY_START -->
## Compact Summary

**Purpose**: Auto-configure CI/CD deployment pipeline for your project type

**Quick Usage**:
```
/agileflow:setup-deployment PLATFORM=auto ENV=both AUTO_DEPLOY=no
```

**What It Does**:
1. Detects project type (static, full-stack, mobile, containers, serverless)
2. Recommends deployment platform based on project
3. Generates platform-specific configuration files
4. Creates CI/CD workflow file
5. Creates .env.example and secrets management docs
6. Shows configuration preview
7. Creates files after YES/NO confirmation
8. Displays next steps (add secrets, connect repo, test deploy)

**Required Inputs**:
- None (all optional with auto-detection)

**Optional Inputs**:
- `PLATFORM=auto|vercel|netlify|heroku|aws|gcp|docker|eas` (default: auto)
- `ENV=staging|production|both` (default: both)
- `AUTO_DEPLOY=yes|no` (default: no, manual trigger)

**Output Files**:
- Platform config (vercel.json, netlify.toml, Dockerfile, etc.)
- `.github/workflows/deploy.yml` - CI/CD workflow
- `.env.example` - Secrets template
- `docs/02-practices/deployment.md` - Deployment guide
- `docs/02-practices/secrets-management.md` - Secrets guide

**Platform Recommendations**:
- Next.js / React → Vercel
- Static sites → Netlify
- Node.js server → Railway, Heroku
- Docker apps → Fly.io
- Mobile (Expo) → EAS
- Serverless → AWS Lambda, Vercel Functions

**Tools Used**:
- TodoWrite: Track 8-step deployment setup workflow

**TodoWrite Example**:
```xml
<invoke name="TodoWrite">
<parameter name="content">
1. Detect project type (static, full-stack, mobile, containers, serverless)
2. Recommend platform based on project type
3. Generate deployment configuration files
4. Create CI/CD workflow file
5. Create .env.example and secrets management docs
6. Show configuration preview
7. Create files after YES/NO confirmation
8. Display next steps (add secrets, connect repo, test deploy)
</parameter>
<parameter name="status">in-progress</parameter>
</invoke>
```

**Workflow**:
1. Detect project type from package.json, Dockerfile, etc.
2. Recommend deployment platform
3. Generate platform-specific config files
4. Create CI/CD workflow (staging + production)
5. Create environment management templates
6. Show preview of all files
7. Ask: "Create deployment configuration? (YES/NO)"
8. If YES: Write files and show next steps

**Example Next Steps**:
```
✅ Deployment configured for Vercel!

Next steps:
1. Add secrets: vercel env add DATABASE_URL
2. Link repo: vercel link
3. Test deploy: git push origin staging
4. Check logs: vercel logs
5. Deploy prod: merge staging → main
```
<!-- COMPACT_SUMMARY_END -->

## Prompt

ROLE: Deployment Pipeline Configurator

TODO LIST TRACKING
**CRITICAL**: Immediately create a todo list using TodoWrite tool to track deployment setup:
```
1. Detect project type (static, full-stack, mobile, containers, serverless)
2. Recommend platform based on project type
3. Generate deployment configuration files
4. Create CI/CD workflow file
5. Create .env.example and secrets management docs
6. Show configuration preview
7. Create files after YES/NO confirmation
8. Display next steps (add secrets, connect repo, test deploy)
```

Mark each step complete as you finish it. This ensures nothing is forgotten during deployment setup.

OBJECTIVE
Detect project type and configure CI/CD deployment to appropriate platform with environment management.

INPUTS (optional)
- PLATFORM=auto|vercel|netlify|heroku|aws|gcp|docker|eas (default: auto-detect)
- ENV=staging|production|both (default: both)
- AUTO_DEPLOY=yes|no (default: no, manual trigger)

PROJECT DETECTION

Analyze project to determine deployment needs:

### Static Sites
- **Indicators**: No backend, HTML/CSS/JS, React/Vue/Angular SPA
- **Platforms**: Vercel, Netlify, GitHub Pages, Cloudflare Pages
- **Recommended**: Vercel (for React/Next.js), Netlify (for general static)

### Full-Stack Web Apps
- **Indicators**: Node.js server, Express/Fastify/Next.js API routes
- **Platforms**: Vercel (Next.js), Heroku, Railway, Fly.io, AWS (ECS/Lambda)
- **Recommended**: Vercel (Next.js), Railway (Docker)

### Mobile Apps (React Native / Expo)
- **Indicators**: expo config, react-native
- **Platforms**: EAS Build, App Center
- **Recommended**: EAS (Expo Application Services)

### Containers
- **Indicators**: Dockerfile present
- **Platforms**: Docker Hub, AWS ECR, GCP Artifact Registry, Fly.io
- **Recommended**: Fly.io (easy Docker deploy)

### Serverless Functions
- **Indicators**: Lambda functions, API Gateway config
- **Platforms**: AWS Lambda, Vercel Functions, Netlify Functions
- **Recommended**: Vercel Functions (for Next.js), AWS SAM

DEPLOYMENT CONFIGURATIONS

### Vercel (Next.js / Static)

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "nextjs",
  "env": {
    "DATABASE_URL": "@database-url-staging",
    "API_KEY": "@api-key"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_API_URL": "https://api.example.com"
    }
  }
}
```

GitHub Actions:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

### Netlify (Static Sites)

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  API_URL = "https://api.example.com"

[context.staging.environment]
  API_URL = "https://staging-api.example.com"
```

---

### Heroku (Node.js)

Create `Procfile`:
```
web: npm start
```

Create `app.json`:
```json
{
  "name": "my-app",
  "description": "My application",
  "buildpacks": [
    {
      "url": "heroku/nodejs"
    }
  ],
  "env": {
    "NODE_ENV": {
      "value": "production"
    },
    "DATABASE_URL": {
      "description": "PostgreSQL connection string",
      "required": true
    }
  }
}
```

GitHub Actions:
```yaml
name: Deploy to Heroku

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.13.15
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "my-app-production"
          heroku_email: "deploy@example.com"
```

---

### Docker (Fly.io / AWS / GCP)

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

Create `.dockerignore`:
```
node_modules
.git
.env
*.log
dist
coverage
```

For Fly.io, create `fly.toml`:
```toml
app = "my-app"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[[services]]
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    port = 80
    handlers = ["http"]

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]
```

Deploy command:
```bash
fly deploy
```

---

### EAS (Expo / React Native)

Create `eas.json`:
```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "user@example.com",
        "ascAppId": "1234567890"
      },
      "android": {
        "serviceAccountKeyPath": "./secrets/google-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

GitHub Actions:
```yaml
name: EAS Build

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build on EAS
        run: eas build --platform all --non-interactive --no-wait
```

---

### AWS (Serverless / Lambda)

Create `serverless.yml`:
```yaml
service: my-app

provider:
  name: aws
  runtime: nodejs20.x
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  environment:
    NODE_ENV: production
    DATABASE_URL: ${ssm:/my-app/${self:provider.stage}/database-url}

functions:
  api:
    handler: dist/index.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true

plugins:
  - serverless-offline
  - serverless-dotenv-plugin
```

GitHub Actions:
```yaml
name: Deploy to AWS Lambda

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4

      - name: Install Serverless Framework
        run: npm install -g serverless

      - name: Deploy
        run: serverless deploy --stage production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

ENVIRONMENT MANAGEMENT

Create `.env.example`:
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb

# API Keys (DO NOT commit actual keys)
API_KEY=your_api_key_here
STRIPE_SECRET_KEY=sk_test_...

# Third-party Services
SENDGRID_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# App Config
NODE_ENV=development
PORT=3000
```

Create docs/02-practices/secrets-management.md:
```markdown
# Secrets Management

## DO NOT commit secrets to Git
- Never commit `.env` files
- Use `.env.example` for templates only

## Deployment Platforms

### Vercel
\`\`\`bash
vercel env add DATABASE_URL production
\`\`\`

### Heroku
\`\`\`bash
heroku config:set DATABASE_URL="postgres://..." --app my-app
\`\`\`

### GitHub Actions
Add secrets in Settings → Secrets and variables → Actions

## Local Development
1. Copy `.env.example` to `.env`
2. Fill in actual values (get from team lead)
3. Never commit `.env` to git
```

DEPLOYMENT WORKFLOW

### Staging → Production Flow

```yaml
name: Deploy

on:
  push:
    branches:
      - main      # → production
      - staging   # → staging

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Determine environment
        id: env
        run: |
          if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
            echo "environment=production" >> $GITHUB_OUTPUT
          else
            echo "environment=staging" >> $GITHUB_OUTPUT
          fi

      - name: Deploy
        run: ./deploy.sh
        env:
          ENVIRONMENT: ${{ steps.env.outputs.environment }}
```

WORKFLOW SUMMARY

1. Detect project type
2. Recommend platform
3. Show configuration preview:
   ```
   Deployment Setup for: Node.js web app
   Recommended platform: Vercel

   Will create:
   - vercel.json (deployment config)
   - .github/workflows/deploy.yml (CI/CD)
   - .env.example (secrets template)
   - docs/02-practices/deployment.md (guide)

   Environments:
   - Staging: staging.example.com (branch: staging)
   - Production: example.com (branch: main)

   Proceed? (YES/NO)
   ```

4. If YES:
   - Create config files
   - Update CI workflows
   - Create deployment docs
   - Show next steps

NEXT STEPS

After setup, guide user:
```
✅ Deployment configuration created!

Next steps:
1. Add secrets to platform:
   - For Vercel: `vercel env add DATABASE_URL`
   - For GitHub Actions: Settings → Secrets

2. Connect repository to platform:
   - Vercel: `vercel link`
   - Heroku: `heroku git:remote -a my-app`

3. Test deployment:
   - Push to staging branch: `git push origin staging`
   - Check logs: `vercel logs` or platform dashboard

4. Deploy to production:
   - Merge staging → main
   - Or manually: `vercel --prod`

5. Set up custom domain (optional):
   - Vercel: `vercel domains add example.com`
   - Netlify: Netlify dashboard → Domain settings

Documentation: docs/02-practices/deployment.md
```

INTEGRATION

- Create story: "US-XXXX: Set up deployment pipeline"
- Update docs/02-practices/deployment.md
- Add deployment status to docs/08-project/README.md

RULES
- Preview all files before creating (diff-first, YES/NO)
- Never commit secrets to repository
- Always use environment variables
- Set up staging environment first
- Test deployment before going to production
- Document rollback procedure

OUTPUT
- Platform recommendation
- Deployment configuration files
- CI/CD workflow
- Environment management guide
- Next steps checklist
