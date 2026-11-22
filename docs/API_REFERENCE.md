# 🔌 API Reference

All endpoints across the two backends.

---

## FastAPI — Gen AI / RAG  (`http://localhost:8000/api/v1`)

### `GET /health`
Health check. Response:
```json
{ "status": "ok", "service": "campus-ai-genai" }
```

### `GET /scholarships/documents`
List all scraped documents.
```json
{
  "count": 62,
  "documents": [
    {
      "id": "02062026035706MT_Notice_10355",
      "title": "02062026035706Mt Notice 10355",
      "category": "Scholarship Notice / Brochure",
      "fileType": "PDF",
      "pages": 1,
      "summary": "The Tribal Welfare Department ...",
      "summarySource": "ai",
      "source": "mptaas",
      "downloadPath": "/api/v1/scholarships/documents/02062026035706MT_Notice_10355/download"
    }
  ]
}
```

### `GET /scholarships/documents/{doc_id}/summary`
**Structured AI summary.** Extracts fields via LLM and caches per doc.
```json
{
  "markdown": "The Tribal Welfare Department ...",
  "summarySource": "ai",
  "aiSummary": {
    "eligibility": "Subject-specific graduation degree (and B.Ed where applicable), meet department age limits, belong to eligible categories",
    "incomeCap": "Not specified in notice",
    "financialBenefits": "Regular state-government salary, allowances and benefits",
    "deadlines": "Key dates incomplete; online application deadline not specified",
    "keyTakeaways": [ "Recruitment for Secondary School Teachers (subject-wise) for 2024...", "..." ],
    "requiredDocuments": [ "Not specified in notice" ]
  }
}
```

### `GET /scholarships/documents/{doc_id}/preview`
Preview PDF (returns PDF file).

### `GET /scholarships/documents/{doc_id}/download`
Download PDF (`application/pdf`).

### `POST /spiders/run`
Trigger spider runs (body may indicate which scraper).

### `GET /spiders/status`
Status of the latest spider run.

---

## Spring Boot —   (`http://localhost:5000/api`)

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Create account (BCrypt-hashed password) |
| POST | `/auth/login` | JWT login |
| GET | `/auth/oauth2/google` | Google OAuth2 token exchange |
| GET | `/auth/me` | Current user from JWT |
| GET/POST | `/resources` | List / upload documents (multipart) |
| GET | `/resources/{id}` | Fetch a resource |
| DELETE | `/resources/{id}` | Remove (admin) |
| GET | `/resources/download` | Drive-backed downloads |
| GET | `/admin/users` | List users (admin) |
| PUT | `/admin/verify` | Approve pending documents (1-click review) |
| GET | `/admin/stats` | Platform analytics |

> OAuth flow: frontend redirects to `/oauth2/authorization/google` → Google → callback `/login/oauth2/code/google` → redirects to frontend with token.

---

## Frontend services mapping

| service file | calls |
|---|---|
| `api.js` | `apiClient` (Spring :5000) & `aiClient` (FastAPI :8000) |
| `authService.js` | `/auth/*`, `/auth/oauth2/google` |
| `resourceService.js` | `/resources*`, Drive folder URLs |
| `summarizerService.js` | AI summary endpoints |
| `chatService.js` | chat/RAG endpoints |
| `adminService.js` | `/admin/*` |
| `plannerService.js` / `quizService.js` | planner/quiz |

---

## Error conventions
- FastAPI returns HTTPException with `detail` (e.g. 404 `"Not found"`).
- Axios interceptors in frontend log when a backend is unreachable and allow mock fallback.
- LLM rate-limit (429) is handled by provider rotation/cooldown inside `_call_llm`.
