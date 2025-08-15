# HanZi Prompt Optimizer

This application optimizes LLM prompts by increasing token efficiency using Chinese Hanzi and applying advanced prompt engineering techniques via a middleware strategy. It is powered by the Google Gemini API.

## Core Features

- **Token Economization:** Reduces prompt token count by substituting English words with more token-efficient Chinese characters (Hanzi).
- **Advanced Prompt Middleware:** A sophisticated pipeline that applies model-specific optimizations, reasoning strategies, and structural tagging to prompts before they are sent for optimization.
- **Industry-Specific Glossaries:** Tailors optimizations for specific domains like Technology, Finance, Law, and more.
- **History Tracking:** Saves and allows reuse of past optimization sessions.
- **Performance Analytics:** Provides metrics beyond token count, including latency and simulated quality scores.

---

## Architecture Guide: Implementing the DSPy Backend

This section outlines the plan for integrating the Python-based DSPy framework for automated, machine-learning-driven prompt refinement.

### 1. The Goal & The Challenge

**Goal:** To add a powerful "Auto-Optimization" feature that uses `dspy-ai` to continuously refine prompts based on performance, moving beyond rule-based optimization.

**Challenge:** The main application is a standard Next.js/TypeScript project running in a Node.js environment. DSPy is a Python framework with heavy dependencies (e.g., PyTorch). A Python environment cannot run directly within the Node.js Vercel serverless environment, requiring a separate service.

### 2. Recommended Architecture: The Microservice Approach

The most robust, scalable, and performant solution is a **dedicated microservice architecture**.

```mermaid
graph LR
    A[Next.js Frontend] --> B{/api/dspy-optimize};
    B --> C[DSPy Microservice (Python/FastAPI)];
    subgraph Vercel Environment
        A;
        B;
    end
    subgraph Google Cloud Run / AWS Fargate
        C;
    end
```

**Workflow:**
1. The user enables "Auto-Optimization (DSPy)" in the UI and submits a prompt.
2. The Next.js frontend calls its own backend API route (`/api/dspy-optimize`).
3. This Next.js API route acts as a **secure proxy**. It reads the DSPy service URL from a server-side environment variable (`DSPY_API_URL`).
4. It forwards the request to the independently deployed Python DSPy microservice.
5. The DSPy service performs the optimization and returns the result to the Next.js proxy, which then sends it back to the frontend.

**Why was this chosen over alternatives?**
An alternative considered was spawning a Python process from the Vercel serverless function. This was rejected due to:
- **High Latency:** Every request would suffer a "cold start," as the entire Python environment and its dependencies would need to be initialized.
- **Execution Timeouts:** Vercel functions have timeouts (e.g., 10-60s). Complex DSPy compilation and optimization can easily exceed these limits, leading to unreliable performance.
- **Lack of Scalability:** The frontend and backend tasks are fundamentally different; scaling them together is inefficient.

The microservice approach solves these issues by allowing the DSPy service to remain "warm," scale independently, and handle long-running tasks reliably.

### 3. API Contract for DSPy Microservice

This section defines the precise API contract that the backend Python service must adhere to for seamless integration.

-   **Endpoint:** `/optimize`
-   **Method:** `POST`
-   **Content-Type:** `application/json`

#### Request Body Schema

The frontend will send a JSON object with the following structure:

```json
{
  "prompt": "The user's original, un-optimized prompt.",
  "industry": "none" | "tech" | "finance" | "medical" | "law" | "art",
  "optimizationLevel": "basic" | "advanced" | "expert"
}
```

-   `prompt` (string, required): The raw text prompt from the user.
-   `industry` (string, required): The currently selected industry glossary. This allows the DSPy service to load relevant few-shot examples.
-   `optimizationLevel` (string, required): The user-selected level of optimization, which can be used by the backend to determine the number of optimization rounds or complexity.

#### Success Response Schema

On a successful optimization (HTTP `200 OK`), the backend must return a JSON object with the following structure:

```json
{
  "optimizedPrompt": "The new prompt that has been refined by the DSPy module."
}
```

-   `optimizedPrompt` (string, required): The resulting prompt after DSPy processing.

#### Error Response Schema

In case of an error (HTTP `4xx` or `5xx`), the backend should return a JSON object with an `error` key:

```json
{
  "error": "A descriptive error message explaining what went wrong."
}
```

### 4. Implementation Plan & Next Steps

The frontend UI for this feature has been built and is currently mocked. The next phase is to build and deploy the backend microservice according to the API contract above.

**Step 1: Build the DSPy Microservice (Python)**
- Use a lightweight framework like **FastAPI**.
- Use Pydantic to define models that match the **Request Body Schema**.
- Create an `/optimize` endpoint that runs the DSPy `teleprompter.compile()` and execution logic.
- Return a response matching the **Success Response Schema** or **Error Response Schema**.
- *File: `dspy_service/app.py`*

**Step 2: Containerize the Service (Docker)**
- Create a `Dockerfile` to package the FastAPI application and its Python dependencies (`dspy-ai`, `uvicorn`, etc.).
- This ensures a consistent, reproducible environment.

**Step 3: Deploy the Microservice**
- Deploy the containerized application to a suitable platform.
- **Recommended:** Google Cloud Run, AWS Fargate, or another container-as-a-service platform.
- Once deployed, you will get a stable URL for the service.

**Step 4: Configure the Next.js Environment**
- In your Vercel project settings, add a new environment variable: `DSPY_API_URL`.
- Set its value to the URL of your deployed Python service from Step 3.

**Step 5: Create the Next.js Proxy Route**
- Create a new API route file: `pages/api/dspy-optimize.ts`.
- This route will receive the request from the frontend.
- It will use `fetch` to call `process.env.DSPY_API_URL`, forwarding the prompt according to the API contract.
- This keeps the microservice URL secure and hidden from the client.

**Step 6: Activate the Frontend UI**
- **This step is complete.** The `optimizeWithDSPy` function in `services/geminiService.ts` contains the mocked logic. To make it live, replace the mocked `setTimeout` logic with a real `fetch` call to `/api/dspy-optimize`.
