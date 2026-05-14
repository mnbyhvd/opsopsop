# SEO CMS Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add CMS-managed Services and Portfolio pages, split the homepage About section into two editable groups, and make prerender produce indexable HTML snapshots for all public routes.

**Architecture:** Follow the existing repo shape: MySQL tables and Express route files in `backend/routes`, React hooks and pages in `frontend/src`, admin CMS pages in `admin/src/pages/admin`. Prerender collects public API data, visits all static and dynamic routes, writes HTML snapshots and sitemap/robots artifacts.

**Tech Stack:** React 18 CRA, TypeScript, Tailwind CSS, Express 4, MySQL2, Puppeteer prerender.

---

### Task 1: Data And API

- [ ] Add `section_group` to `about_section`.
- [ ] Add `service_blocks`, `portfolio_projects`, and `portfolio_sections`.
- [ ] Add `/api/services` and `/api/portfolio`.
- [ ] Mount routes in `backend/server.js`.

### Task 2: Public Frontend

- [ ] Add `useServices`, `usePortfolio`, `/services`, `/portfolio`, and `/portfolio/:slug`.
- [ ] Render `AboutSection` twice on the homepage with `main` and `secondary` groups.
- [ ] Add navigation fallback items for Services and Portfolio.
- [ ] Add Helmet titles/descriptions/canonicals for new pages and detail pages.

### Task 3: Admin CMS

- [ ] Add Services CMS with create/edit/delete/order/image/active fields.
- [ ] Add Portfolio CMS with project CRUD and section CRUD.
- [ ] Add About group selection so homepage About #1 and About #2 are managed separately.

### Task 4: Prerender And SEO

- [ ] Add `/services`, `/portfolio`, and `/portfolio/:slug` to prerender.
- [ ] Fetch dynamic product/project routes from API before rendering.
- [ ] Wait for React/API content before saving HTML.
- [ ] Generate `sitemap.xml`, `robots.txt`, and `prerender-report.json`.

### Task 5: Verification

- [ ] Run TypeScript production builds for frontend and admin.
- [ ] Run syntax checks for changed backend/prerender JS files.
- [ ] Report exact verification status and remaining deployment step for DB migration.
