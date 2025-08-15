# HanZi Prompt Optimizer (T3 Stack Edition)

This application optimizes LLM prompts by increasing token efficiency using Chinese Hanzi and applying advanced prompt engineering techniques. It is powered by the Google Gemini API and built on the T3 Stack for a fully type-safe, modern web experience.

## The Stack

- **Framework:** Next.js (App Router)
- **API:** tRPC
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

---

## Project Setup & Deployment Guide

This project has been migrated from a buildless prototype to a professional T3 Stack application. Follow these steps to set up your local environment and deploy to Vercel.

### Step 1: Create the T3 Application

On your local machine, run the `create-t3-app` command to generate the boilerplate. **It is crucial to select the options that match this project's structure.**

```bash
npx create-t3-app@latest hanzi-ai-prompt-optimizer
```

When prompted, choose the following options:
- **`Would you like to use TypeScript?`** ... (Yes, this is default)
- **`Would you like to use Tailwind CSS?`** ... **Yes**
- **`Would you like to use tRPC?`** ... **Yes**
- **`Would you like to use authentication?`** ... **None** (Can be added later if needed)
- **`Would you like to use a database ORM?`** ... **None for now** (We will add Prisma/Drizzle later for analytics)
- **`Would you like your code inside a src/ directory?`** ... **Yes**
- **`Would you like to use App Router?`** ... **Yes**
- **`Would you like to customize the import alias?`** ... **No** (Keep the `@/*` default)

This will create a new directory named `hanzi-ai-prompt-optimizer` with the correct project structure.

### Step 2: Replace Files & Install Dependencies

1.  **Replace Generated Files:** Delete the contents of the generated project and replace them with the files provided in this repository.
2.  **Install Dependencies:** Navigate into your new project directory and install the necessary libraries. The T3 boilerplate includes most dependencies, but you need to add the Google GenAI SDK.

```bash
cd hanzi-ai-prompt-optimizer
npm install @google/genai
```

### Step 3: Configure Environment Variables

1.  In the root of your project, create a new file named `.env`.
2.  Add your Google Gemini API key to this file. **Never commit this file to GitHub.**

```.env
# .env
# T3 automatically loads this for you.
# Make sure to add .env to your .gitignore file.

API_KEY="your_google_gemini_api_key_here"
```

The T3 starter includes a robust environment variable validation system (`src/env.js`) that ensures your app won't build or run without the required keys.

### Step 4: Run Locally & Deploy

1.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` in your browser to see the application running.

2.  **Deploy to Vercel:**
    - Push your project to your GitHub repository.
    - Connect the repository to Vercel. Vercel will automatically detect the Next.js framework.
    - **Crucially**, in the Vercel project settings, go to "Environment Variables" and add your `API_KEY` with the same value from your `.env` file.
    - Trigger a deployment.

---

## Architecture Overview

### Type-Safe API with tRPC

All communication between the frontend and backend is handled via tRPC. The Gemini API logic now resides securely on the server and is exposed to the client as a type-safe procedure.

- **Frontend:** The main UI in `src/app/page.tsx` uses tRPC's React Query hooks (e.g., `api.prompt.optimize.useMutation`) to call the backend.
- **Backend:** The tRPC router in `src/server/api/routers/prompt.ts` contains the server-side logic that securely calls the Google Gemini API.

### DSPy Microservice Integration (Future)

The plan for integrating the Python-based DSPy service remains the same. The tRPC backend will act as the secure proxy to the separately hosted Python microservice. The `optimizeWithDSPy` procedure is currently mocked and ready for this integration.

### Analytics & Database (Future)

The next major feature will be adding metrics tracking and analysis.
- **Database:** We will use a serverless database like **Vercel Postgres** with **Prisma** as the ORM.
- **Analytics:** For complex analysis of prompt history and performance, we will explore loading data from the primary database into an in-memory **DuckDB** instance within a serverless function to generate insights on demand.
