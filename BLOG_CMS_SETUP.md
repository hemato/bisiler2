# Blog CMS Setup with Strapi (Free)

## Overview
This guide sets up a free, open-source blog content management system using Strapi as a headless CMS integrated with your Astro project.

## Why Strapi?
- **100% Free & Open Source** - No membership fees or subscriptions
- **Self-hosted** - Full control over your data
- **Built-in Admin Panel** - Easy content management interface
- **REST & GraphQL APIs** - Perfect for Astro integration
- **SQLite Support** - No external database required
- **Multi-language Support** - Built-in i18n

## Setup Steps

### 1. Create Strapi Project
```bash
# Create a new Strapi project with SQLite (quickstart)
npx create-strapi@latest blog-cms --quickstart

# Navigate to the project
cd blog-cms

# Start the development server
npm run develop
```

### 2. Admin Panel Setup
1. Open http://localhost:1337/admin
2. Create your first admin user (free, no membership required)
3. Set up your blog content types

### 3. Content Types to Create
- **Blog Post** (Collection Type)
  - Title (Text)
  - Slug (UID)
  - Content (Rich Text)
  - Excerpt (Text)
  - Featured Image (Media)
  - Author (Text)
  - Category (Text)
  - Tags (JSON)
  - Published At (Date)
  - SEO Title (Text)
  - SEO Description (Text)
  - Language (Select: TR, EN)

- **Category** (Collection Type)
  - Name (Text)
  - Slug (UID)
  - Description (Text)
  - Language (Select: TR, EN)

- **Tag** (Collection Type)
  - Name (Text)
  - Slug (UID)
  - Language (Select: TR, EN)

### 4. API Configuration
- Make sure the blog content types have public read permissions
- Configure CORS for your Astro domain (localhost:4321)

### 5. Astro Integration
The existing Astro project will fetch blog data from Strapi's REST API and render static pages.

## Benefits
- **Free Forever** - No subscription costs
- **Easy Content Management** - Non-technical users can manage content
- **SEO Friendly** - Static generation with dynamic content
- **Multi-language** - Built-in support for TR/EN content
- **Scalable** - Can handle thousands of blog posts
- **Media Management** - Built-in image upload and management

## Production Deployment
- Deploy Strapi to free platforms like Railway, Heroku, or DigitalOcean
- Use PostgreSQL for production database
- Keep Astro as static site generator for fast performance
