# CRM AI Engine (Member 3)

An independent, production-ready AI Intelligence and Background Job Processing Module designed as a modular monolith for an AI-Powered CRM Sales Management Platform. It integrates with Google Gemini API, MongoDB, Redis, and BullMQ to deliver intelligent lead scoring, dynamic context assembly, auto-drafted email generation, and reliable background jobs.

---

## 1. Project Overview
The **crm-ai-engine** is a standalone TypeScript backend that automates sales operations. Its primary goals are to:
- Score leads asynchronously in the background.
- Leverage **Google Gemini AI** (`gemini-2.5-flash`) for lead analysis, summaries, next best actions, and personalized email templates.
- Guarantee reliability and resiliency using BullMQ, automatic retries with exponential backoffs, and strict idempotency checking.
- Maintain robustness via strict Zod parsing schema validations and fallback rule-based handlers if the AI API is unreachable.

---

## 2. Architecture Explanation
The module conforms to a **Modular Monolith Architecture**. It separates modules cleanly, ensuring the AI domain is decoupled from other systems. It operates using the following layers:
- **Database Layer**: Standardizes collection structures using Mongoose models (`Lead`, `Activity`, `FollowUp`).
- **Context Builder Layer**: Assembles the complete historic timeline of a Lead (profile + 5 latest activities + 5 latest follow-ups).
- **Service Layer**: Connects to the Gemini SDK, manages the prompts centrally, executes schema parsing, handles repair loops, and provides fallback algorithms.
- **Queue/Worker Layer**: Standardizes job specifications in BullMQ, managing parallelization, concurrency control, and job retry lifecycles.
- **Controller/Routing Layer**: Exposes Express REST APIs.

---

## 3. Folder Structure
```
crm-ai-engine/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── redis.ts
│   ├── modules/
│   │   ├── lead/
│   │   │   └── lead.model.ts
│   │   ├── activity/
│   │   │   └── activity.model.ts
│   │   ├── followup/
│   │   │   └── followup.model.ts
│   │   └── ai/
│   │       ├── ai.controller.ts
│   │       ├── ai.service.ts
│   │       ├── ai.schema.ts
│   │       └── context-builder.ts
│   ├── prompts/
│   │   ├── lead-analysis.prompt.ts
│   │   └── email-generation.prompt.ts
│   ├── queues/
│   │   └── scoring.queue.ts
│   ├── workers/
│   │   └── scoring.worker.ts
│   ├── routes/
│   │   └── ai.routes.ts
│   ├── app.ts
│   └── server.ts
├── .env.example
├── package.json
└── README.md
```

---

## 4. Installation Steps
1. Clone the repository and navigate to the project directory:
   ```bash
   cd crm-ai-engine
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Compile the TypeScript source code:
   ```bash
   npm run build
   ```
4. Run in development mode (auto-reloading):
   ```bash
   npm run dev
   ```

---

## 5. Environment Setup
Create a `.env` file in the root directory and configure the variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm-ai-engine
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_google_gemini_api_key
```

### MongoDB Setup
Make sure MongoDB is running locally or provide a connection URI from Atlas.

### Redis Setup
A running Redis instance is required for BullMQ. Ensure it is accessible at the specified `REDIS_URL`.

### Gemini Setup
Get a Gemini API Key from Google AI Studio and define it under `GEMINI_API_KEY`. If this key is missing or invalid, the engine will run in fallback rule-based mode, ensuring zero crashes.

---

## 6. Queue & Worker Lifecycle
```
[Client Endpoint] -> POST /api/v1/ai/leads/:id/analyze
                       |
                       v
            [scoringQueue.add()]
          (Idempotent Job: lead-{id})
                       |
                       v
                 [Redis Queue]
                       |
                       v
         [scoringWorker (Concurrency: 5)]
                       |
        +--------------+--------------+
        |                             |
        v                             v
[Success: Update DB]        [Fail: Retry (3 attempts)]
                            [Exponential Backoff: 5s]
```

### AI Validation & Repair Strategy
1. **Schema Check**: All API responses from Gemini are validated using **Zod** (`LeadAnalysisSchema`, `EmailGenerationSchema`).
2. **Auto-Repair**: If Gemini returns malformed JSON, a repair prompt is immediately dispatched with validation error logs to correct it.
3. **Robust Fallback**: If the repair fails or the API times out, the module uses rule-based scoring (50 base, +20 for >3 activities, +10 for >2 followups) and a static fallback HTML email template.

---

## 7. API Documentation

### Health Check
* **Method**: `GET`
* **Route**: `/health`
* **Response**: `200 OK`
  ```json
  {
    "status": "ok"
  }
  ```

### Analyze Lead (Queue Background Job)
* **Method**: `POST`
* **Route**: `/api/v1/ai/leads/:id/analyze`
* **Response**: `202 Accepted`
  ```json
  {
    "success": true,
    "message": "Analysis queued"
  }
  ```

### Generate Follow-Up Email
* **Method**: `POST`
* **Route**: `/api/v1/ai/generate-email`
* **Body** (`application/json`):
  ```json
  {
    "leadName": "John",
    "company": "ABC Corp",
    "purpose": "Follow up after product demo"
  }
  ```
* **Response**: `200 OK`
  ```json
  {
    "subject": "Follow-up Discussion: Product Demo Next Steps",
    "body_html": "<h3>Hello John</h3><p>Thank you for taking the time to review our platform on behalf of ABC Corp...</p>"
  }
  ```

---

## 8. Postman Testing Guide & Test Cases
Import the following requests into Postman to test the workflows:

### Case 1: Health Check
- **URL**: `http://localhost:5000/health`
- **Method**: `GET`
- **Expected Status**: `200`
- **Expected Body**: `{ "status": "ok" }`

### Case 2: Analyze Lead Endpoint
- **URL**: `http://localhost:5000/api/v1/ai/leads/<LEAD_MONGO_ID>/analyze`
- **Method**: `POST`
- **Expected Status**: `202`
- **Expected Body**: `{ "success": true, "message": "Analysis queued" }`

### Case 3: Generate Email Endpoint
- **URL**: `http://localhost:5000/api/v1/ai/generate-email`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "leadName": "Alice Smith",
    "company": "Innovate LLC",
    "purpose": "Follow up after demo call"
  }
  ```
- **Expected Status**: `200`
- **Expected Body JSON**:
  - Should contain fields `"subject"` and `"body_html"`.

### Case 4: Queue & Worker Flow Verification
1. Create a dummy Lead in your MongoDB (`Lead` collection) using MongoDB Compass or shell.
2. Trigger the `Analyze Lead` API using its ObjectId.
3. Observe terminal logs. You will see:
   - `[Queue] Adding lead analysis job to 'lead-scoring' queue.`
   - `[Worker] Processing Job ID: lead-<id> for Lead ID: <id>`
   - `[AI Service] Sending Lead Analysis request to Gemini...`
   - `[Worker] Job Success. Job ID: lead-<id>, Lead ID: <id>, New Score: <calculated_score>`
4. Query the Lead document in the database and verify that `conversionScore`, `probabilityClass`, `aiAnalysisSummary`, and `nextBestAction` fields have been populated.

### Case 5: Fallback Path Verification
1. Turn off your internet connection or remove the `GEMINI_API_KEY` in `.env`.
2. Send an analyze request.
3. Check worker logs. It will report:
   - `[AI Service] Gemini Lead Analysis failed. Executing fallback rule-based strategy. Error: ...`
   - `[AI Service] Computing Rule-Based Scoring for Lead: ...`
   - The lead's document in the DB will still update successfully with the calculated score, ensuring the process never crashes.

---

## 9. Future CRM Integration Plan
When integrating this module into the main CRM backend (e.g. Member 2's codebase):
1. **Shared Database**: Both modules will connect to the same MongoDB. Member 3's models will map to the existing `leads`, `activities`, and `followups` collections in the shared database.
2. **Event Triggers**: In the main backend, when a new activity or followup is saved, add a hook to call `queueLeadAnalysis(leadId)` from `scoring.queue.ts`. This triggers the background job automatically.
3. **API Middleware**: The routing paths (`/api/v1/ai/...`) can be registered inside the main routing table of the CRM Express app.
