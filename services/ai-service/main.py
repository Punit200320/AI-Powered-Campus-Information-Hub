from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import os
import sys
import gspread
import requests

# Fix Windows encoding
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

app = FastAPI(title="Campus AI Service", version="1.0.0")

# Enable CORS for Frontend (localhost:8081, localhost:5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FREE_MODELS = [
    "openrouter/free",
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
    "nvidia/nemotron-3.5-lightning:free",
]

CREDENTIALS_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "config", "credentials.json")


def get_scholarships():
    try:
        gc = gspread.service_account(filename=CREDENTIALS_PATH)
        sheet = gc.open("Scholarships_DB").sheet1
        return sheet.get_all_records()
    except Exception as e:
        print(f"Sheet error: {e}")
        return []


class ChatRequest(BaseModel):
    message: str
    mode: Optional[str] = "balanced"


class Citation(BaseModel):
    id: str
    title: str
    page: Optional[str] = "Web Portal"
    author: Optional[str] = "Campus AI Verified Source"


class ChatResponse(BaseModel):
    reply: str
    citations: List[Citation] = []


@app.get("/")
def health_check():
    return {"status": "ok", "service": "Campus AI Microservice", "version": "1.0.0"}


@app.get("/api/v1/scholarships")
def list_scholarships():
    """Returns all scholarships from Google Sheet"""
    data = get_scholarships()
    return {"count": len(data), "data": data}


@app.post("/api/v1/chat/generate", response_model=ChatResponse)
def generate_chat(req: ChatRequest):
    """Real AI Chatbot endpoint matching frontend chatService.js expectations"""
    scholarships = get_scholarships()
    api_key = os.getenv("OPENROUTER_API_KEY", "").strip()

    prompt = f"""
You are Campus Assistance AI, a knowledgeable, empathetic college academic and scholarship counselor.
Here is the live verified campus database from our Google Sheet:
{json.dumps(scholarships, indent=2, ensure_ascii=False)}

STUDENT QUESTION:
"{req.message}"

INSTRUCTIONS:
1. Provide a comprehensive, structured, and helpful response.
2. If scholarships/opportunities match their inquiry, detail their name, award, deadline, and application links.
3. Answer politely in the user's language (English or Hinglish/Hindi).
4. Highlight key action items or deadlines.
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8081",
        "X-Title": "Campus AI Hub",
    }

    # Generate response via OpenRouter
    reply_text = None
    if api_key:
        for model in FREE_MODELS:
            try:
                res = requests.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=headers,
                    json={
                        "model": model,
                        "messages": [
                            {"role": "system", "content": "You are Campus Assistance AI."},
                            {"role": "user", "content": prompt},
                        ],
                        "temperature": 0.7,
                    },
                    timeout=45,
                )
                if res.status_code == 200:
                    data = res.json()
                    reply_text = data["choices"][0]["message"]["content"]
                    break
            except Exception as e:
                print(f"Error with model {model}: {e}")
                continue

    if not reply_text:
        # Fallback contextual response using live sheet data if API key is not set
        reply_text = f"### 🎓 Campus Assistance AI\n\nI searched our live campus database ({len(scholarships)} records). For **'{req.message}'**, here are the current opportunities:\n\n"
        for s in scholarships[:3]:
            reply_text += f"- **{s.get('Title')}** ({s.get('Amount')}) — Deadline: {s.get('Deadline')}\n  Apply: {s.get('Link')}\n\n"

    # Extract citations
    citations = [
        Citation(
            id=f"cit_{i}",
            title=s.get("Title", "Campus Record"),
            page=s.get("Deadline", "Active"),
            author=s.get("Provider", "Campus Portal"),
        )
        for i, s in enumerate(scholarships[:3], 1)
    ]

    return ChatResponse(reply=reply_text, citations=citations)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

