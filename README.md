# Expense

A responsive expense tracker built with Next.js App Router, React, Chart.js, and Lucide icons. The interface uses an emerald and warm neutral palette, with separate public, authentication, and dashboard layouts.

## Run locally

Use Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. On Windows PowerShell, use `npm.cmd` if your execution policy blocks `npm.ps1`.

A local, Git-ignored `.env` has been created:

```dotenv
NEXT_PUBLIC_API_URL=https://expense-backend-mu-livid.vercel.app
```

For a fresh checkout, copy `.env.example` to `.env`. Restart the dev server after editing it or `next.config.mjs`. Browser requests go to the same-origin `/api/backend/*` path; Next.js rewrites them to this backend URL. This avoids browser CORS restrictions on local and preview frontend origins. Run the frontend with a Next.js server or a compatible hosting platform; the proxy requires a server and does not work with a static-only export.

### Vercel configuration

The local `.env` is Git-ignored and is not included in a Git-based Vercel deployment. The proxy defaults to `https://expense-backend-mu-livid.vercel.app` when the environment variable is missing or blank, so a fresh deployment can build successfully. To override it, set `NEXT_PUBLIC_API_URL` in your Vercel project's environment variables for the relevant environments and redeploy. The backend address is public configuration, not a secret.

## Folder structure

```text
app/
  (public)/                 Public website and guest budget planner
    layout.jsx              Public header and footer
    page.js                 Landing page
    guest/                  Guest planner
    page2/, page3/          Redirects for the original public URLs
  (auth)/                   Sign-in and registration
    layout.jsx              Shared authentication layout
    sign-in/, sign-up/
  (dashboard)/
    dashboard/
      layout.jsx            Authenticated dashboard shell
      page.jsx              Overview and charts
      expenses/             Search, sort, edit, delete, and export expenses
      budgets/              Spending goal and category overview
      feedback/             Feedback form
  layout.js                 Server root layout, metadata, providers
  globals.css               Design tokens and shared element styles
  error.jsx, not-found.jsx   Application fallback states
components/
  public/                   Website navigation, footer, illustrative preview
  auth/                     Shared account form and password reset dialog
  dashboard/                Shell, charts, summary cards, expense dialog
  ui/                       Reusable dialogs, headings, and feedback states
  providers.jsx             Single application-wide notification container
hooks/
  use-expense-report.js     Report loading, cancellation, errors, and refresh
lib/
  api.js                    API URL, requests, auth headers, expense endpoints
  format.js                 BDT formatting, report normalization, Excel export
styles/
  public.css                Public website
  auth.css                  Authentication and form/dialog styling
  dashboard.css             Dashboard and guest planner
  responsive.css            Tablet/mobile breakpoints and reduced motion
tests/
  frontend.spec.js          Browser integration tests with mocked API responses
```

Route groups in parentheses organize source files without changing URLs. For example, `app/(dashboard)/dashboard/expenses/page.jsx` remains available at `/dashboard/expenses`.

## API integration

All requests use `lib/api.js`; no component hardcodes the backend host. `next.config.mjs` forwards the same-origin API requests to the configured backend, preserving HTTP methods, bodies, Bearer headers, and response status codes. Existing backend endpoint paths and payload keys are preserved.

| Feature                 | Method | Endpoint                                 |
| ----------------------- | ------ | ---------------------------------------- |
| Sign in                 | POST   | /users/auth/userlogin                    |
| Register                | POST   | /users/auth/user/register                |
| Password reset request  | POST   | /user/forgetpassword                     |
| Password update         | POST   | /user/updatepassword                     |
| Profile                 | GET    | /user/profile                            |
| Maintenance notice      | GET    | /maintenance/alert                       |
| Expense report          | GET    | /expense/user/expensereport              |
| Add category and amount | PUT    | /expense/user/:category/:amount          |
| Rename category         | PATCH  | /expense/category/rename/:category/:name |
| Update amount           | PATCH  | /expense/category/price                  |
| Delete category         | PATCH  | /expense/category/delete/:category       |
| Update spending goal    | PUT    | /expense/goal                            |
| Feedback                | POST   | /feedback/addFeedback                    |
| Guest entry             | POST   | /auth/joinasguest                        |
| Guest budget            | POST   | /guest/budget                            |

Authenticated requests use the existing `authToken` localStorage key and Bearer header. Storage is only accessed in the browser. The dashboard handles missing, malformed, and expired tokens, and redirects on authenticated 401 responses. This is a frontend navigation guard; the backend must continue enforcing authorization.

The report contract is:

```json
{
  "data": { "Groceries": 5000, "Transport": 2000 },
  "totalSpending": 7000,
  "total_expense_goal": 30000
}
```

The API currently exposes aggregate spending by category, so the UI shows an all-time category report. It does not invent transaction dates or monthly trends. Saving a budget goal includes the loaded categories to avoid replacing the existing report with an empty object. Guest plans are not transferred into a registered account.

The landing-page preview is explicitly illustrative; the signed-in dashboard uses API data. Workbook generation is loaded on demand and writes numeric BDT amounts.

## Checks

```bash
npm run lint
npm run format:check
npm run build
npx playwright install chromium
npm run test:e2e
```

Browser tests start the production app on port 3100, so build first. They mock all API requests and do not create accounts, send feedback, or modify the live backend. Tests cover public navigation, session guards, login, registration validation, expense CRUD and exports, goal preservation, empty/error recovery, guest budgets, and password reset on desktop and mobile. Layout screenshots are saved under Git-ignored `test-results/`.

To use an existing Chrome installation instead of downloading Chromium:

```powershell
$env:PLAYWRIGHT_CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
npm.cmd run test:e2e
```

The live backend was checked with read-only requests. Full authenticated live API verification requires a test account; automated integration checks use the existing frontend contracts.

## Dependency baseline

Unused UI and animation packages were removed, and Next.js was updated from 14.2.2 to the latest available 14.x maintenance release, 14.2.35. The React 18 / Next.js 14 architecture is retained.

`npm audit` still reports advisories affecting this legacy framework line and the existing `xlsx` package, as well as transitive dependencies. This is not a clean security audit. A framework major-version migration and replacement of the Excel library need separate compatibility work before production rollout; the application only writes spreadsheets and does not import untrusted workbooks.
