
# HanZi Prompt Optimizer (T3 Stack Edition)

![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)

An application to reduce the token count and optimize prompts sent to LLMs by eliminating unnecessary words, substituting with more token-efficient Chinese Hanzi, and using best-practice prompt engineering techniques. This version is a production-ready application built on the T3 Stack, with all API calls handled securely on the backend.

---

## Key Features

- **Secure Backend:** Your Gemini API key is never exposed to the browser. All API calls are proxied through a secure tRPC backend.
- **Advanced Optimization:** Utilizes Hanzi substitution, classical Chinese idioms (Chengyu), and symbolic logic for maximum token economy.
- **Industry Glossaries:** Specialized optimization modes for Tech, Finance, Medical, Law, and Art & Design.
- **Image-to-Prompt (Art Mode):** Upload an image to generate a descriptive, optimized prompt for AI art generators like Midjourney or DALL-E 3.
- **Negative Prompts:** Specify what you *don't* want in the output for more precise control.
- **Prompt Middleware:** Apply advanced strategies like Chain-of-Thought, XML structuring, and model-specific optimizations.
- **Persistent History & Notes:** Your session history and a personal notepad are saved in your browser's local storage.
- **Fully Type-Safe:** Built with TypeScript and tRPC for end-to-end type safety, reducing bugs and improving developer experience.

---

## 1. Project Setup: Migrating from the Prototype

This project has been upgraded from a simple HTML/TSX prototype to a full-stack T3 application. To avoid conflicts, it is **highly recommended to start with a fresh folder**.

### Step 1: Clean Your Project Directory

If you are working in your old project folder, you **must delete the obsolete files** from the original prototype.

**Delete the following files and folders from the ROOT of your project:**

-   `index.html`
-   `index.tsx`
-   `App.tsx`
-   `types.ts` (the one in the root, not `src/types/index.ts`)
-   `components/` (the entire folder in the root, not `src/components/`)
-   `services/` (the entire folder)

**Your project should now only contain the T3 Stack structure (`src/`, `package.json`, etc.).**

### Step 2: Install Dependencies (macOS Terminal)

Open your terminal, navigate to your clean project folder, and run this command. This will download all the necessary libraries for the project to run.

```bash
npm install
```

### Step 3: Configure Environment Variables

1.  In the root of your project, create a new file named `.env`.
2.  Add your Google Gemini API key to this file. The app will not run without it.

```.env
# .env - This file is for local development and should NOT be committed to GitHub.

API_KEY="your_google_gemini_api_key_here"
```

---

## 2. Running the App Locally

With the setup complete, you can run the local development server.

```bash
npm run dev
```

This command will start the server. Once it's ready, open your web browser and navigate to:

**=> [http://localhost:3000](http://localhost:3000)**

You will see your application running. The server will automatically reload whenever you save a change in a file inside the `src/` directory.

---

## 3. GitHub & Vercel Deployment Guide

### Step 1: Sync with GitHub

1.  Go to [GitHub](https://github.com) and create a new, empty repository. Do **not** initialize it with a README or .gitignore.
2.  In your local project terminal, initialize Git and push your code to the new repository.

```bash
# Make sure you are in your project's root folder
git init -b main
git add .
git commit -m "Initial commit of T3 HanZi Optimizer"

# Get the repository URL from GitHub (it looks like https://github.com/YourUsername/YourRepoName.git)
git remote add origin [YOUR_GITHUB_REPOSITORY_URL]
git push -u origin main
```

### Step 2: Deploy to Vercel

1.  Go to [Vercel](https://vercel.com) and sign up or log in with your GitHub account.
2.  On your dashboard, click "Add New... > Project".
3.  Import the GitHub repository you just created. Vercel will automatically detect that it's a Next.js project.
4.  **This is the most important step:** Before deploying, go to the "Environment Variables" section. Add a new variable:
    -   **Name:** `API_KEY`
    -   **Value:** Paste the same Google Gemini API key from your `.env` file.
5.  Click the "Deploy" button. Vercel will build and deploy your application. Once finished, you will have a public URL for your live app.

---

## 4. Technology & Dependencies

-   **Framework:** Next.js
-   **API Layer:** tRPC
-   **Styling:** Tailwind CSS
-   **State Management:** React Query (via tRPC)
-   **Schema Validation:** Zod
-   **Core AI SDK:** `@google/genai`

---

## 5. Backend Roadmap: DSPy Microservice

The "Auto-Optimization (DSPy)" feature is currently mocked. The plan is to implement it as a separate Python-based microservice.

-   **Why Python?** The DSPy framework from Stanford is a powerful Python library for programmatically optimizing prompts. It treats prompts as programs that can be compiled and improved with metrics.
-   **Architecture:**
    1.  A lightweight Python web server (e.g., using FastAPI) will host the DSPy logic.
    2.  The Next.js tRPC backend will make secure, server-to-server API calls to this Python microservice when the DSPy option is enabled.
    3.  This architecture separates concerns, allowing the Python service to focus solely on complex prompt optimization while the Next.js app handles the UI, state, and standard API calls.