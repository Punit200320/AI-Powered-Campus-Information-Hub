# 🎓 AI Campus Assistant with Resource Finder

A premium, production-grade frontend web platform built for modern universities and colleges. Combines design sensibilities of Linear, Notion, and Vercel with intelligent, LLM-powered academic assistance.

---

## 🌟 Key Highlights & Design Direction

- **Glassmorphism UI:** Sophisticated translucent glass panels, backdrop blurs (`backdrop-filter: blur(16px)`), subtle glowing borders, and rounded cards.
- **Sophisticated Color Palette:**
  - **Primary:** Electric Indigo & Blue (`#4f46e5`, `#6366f1`)
  - **Secondary:** Deep Violet (`#8b5cf6`, `#7c3aed`)
  - **Accents:** Neon Cyan (`#06b6d4`) and Emerald
  - **Dark Mode:** Deep Navy Charcoal (`#090d16`, `#0f172a`, `#131d36`)
  - **Light Mode:** Crisp off-white (`#f8fafc`, `#ffffff`)
- **Fluid Motion Design:** Built with Framer Motion, featuring spring-based interactions, smooth page transitions, collapsible sidebar animations, and confetti celebrations.
- **Role-Based Experience:** Instant persona switcher (Student, Faculty, Admin) available on both the navigation bar and authentication screens.

---

## 🚀 Main Application Pages & Features

### 1. 🏠 Landing Page (`/` or `/landing`)
- Premium hero section with badge and animated gradient headline: *"Your Intelligent Campus Companion"*.
- Interactive live product preview with tabbed switcher (AI Chat, Resource Finder, Quiz Engine, Study Planner).
- Feature showcases with hover lift and glowing borders.
- How-it-works workflow architecture (Ask $\\rightarrow$ Vector RAG $\\rightarrow$ Mastery).
- Modern tech stack showcase (React, Node.js, FastAPI, Qdrant, Gemini, PostgreSQL).

### 2. 🔐 Authentication (`/login` & `/register`)
- Dual auth screens with animated tab transitions.
- Persona selector: **Student**, **Faculty**, **Admin** with 1-click test fill.
- Password visibility toggle with Lucide icons.
- Form validation and input states.

### 3. 📊 Student Dashboard (`/dashboard`)
- Dynamic greeting based on current local time (*"Good morning/afternoon/evening, Alex"*).
- Metrics: Study Hours, Documents Analyzed, MCQs Practiced, 7-Day Study Streak.
- Quick-launch feature action cards.
- AI-recommended learning topics with confidence meters.
- Recently uploaded faculty-verified study materials with instant preview.
- Campus notices & urgency-tagged deadline trackers.

### 4. 🤖 AI Campus Chatbot (`/chat`)
- Perplexity / ChatGPT-style interface with response streaming simulation.
- 3-dot bouncing typing indicator.
- Markdown response formatting: code blocks, mathematical equations, formatted tables, lists.
- Verified source document citations (with PDF filename and page references).
- Suggested starter question chips.
- Chat history sidebar with categorized dialogs.
- Copy response button with feedback toast, regenerate response button, and new session generator.

### 5. 🔍 Resource Finder (`/resources`)
- Real-time search with instant results.
- Category filters: *All, Lecture Notes, Previous Year Questions (PYQs), Lab Manuals, Research Papers*.
- Department and Semester filters.
- Top-ranked study materials with ratings, downloads, and verified faculty badges.
- Bookmark toggle with state management and local storage persistence.
- Document preview modal with sample text inspection.

### 6. 📄 Document Summarizer (`/summarize`)
- Drag-and-drop file upload zone (PDF, DOCX, TXT).
- 1-Click preloaded sample documents (*Campus Placement Policy 2026*, *Operating Systems Unit 4*, *Merit Scholarship Norms*).
- Animated multi-stage upload progress:
  1. Uploading document to secure memory
  2. Extracting text and optical structures
  3. Computing dense embeddings via Gemini API
  4. Synthesizing structured academic summary
- Structured breakdown cards:
  - Executive Overview
  - Important Dates & Deadlines
  - Eligibility Requirements
  - Required Documents Checklist (with interactive checkboxes)
  - Actionable Application Procedures

### 7. 🧠 AI Question Generator (`/quiz`)
- Subject and unit selectors (e.g. Data Structures, Operating Systems, Computer Networks).
- Difficulty selector (*Easy, Medium, Hard, Exam-Level*) and question count.
- Interactive question cards with animated option choices.
- Immediate explanation and reasoning reveal after confirming answers.
- Automated score calculation, percentage, and confetti celebration.

### 8. 📅 Personalized Study Planner (`/planner`)
- Target examination countdown timer.
- Today's focus blocks with interactive checkbox completion and strikethrough animations.
- Weekly load distribution (Monday to Sunday).
- Weak topic diagnostics radar/progress bars.
- *"AI Optimize Schedule"* action prioritizing weak topics based on circadian focus.

### 9. 🛡️ Admin & Faculty Dashboard (`/admin`)
- Overview statistics: Total Students, AI Queries Today, Vector Storage Size, System Uptime.
- Recharts-powered real-time query traffic area chart.
- Document management table with search filter and approve/delete actions.
- Confirmation modal for vector database purging.
- Modal to index new faculty documents into Qdrant.
- Trending student inquiries leaderboard.

### 10. 🔖 Saved Resources (`/saved`)
- Dedicated view of all starred study materials.
- Direct download and unbookmark actions.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | React 18.3 + Vite 5 |
| **Styling** | Tailwind CSS 3.4 (with custom glassmorphism) |
| **Animations** | Framer Motion 11 |
| **Routing** | React Router DOM 6 |
| **Charts** | Recharts 2 |
| **Icons** | Lucide React |
| **Notifications**| React Hot Toast |
| **API Client** | Axios (configured with interceptors & offline fallback) |
| **Confetti** | Canvas Confetti |

---

## 🏃 Quick Start Guide

### 1. Install Dependencies
\`\`\`bash
cd Frontend
npm install
\`\`\`

### 2. Start Development Server
\`\`\`bash
npm run dev
\`\`\`
The application will be live at \`http://localhost:5173\`.

### 3. Build for Production
\`\`\`bash
npm run build
\`\`\`

---

## 🌐 Backend Architecture Integration Guide

This frontend is prepared for connection to:
- **Node.js + Express:** API Gateway & JWT Auth (\`http://localhost:5000/api\`)
- **Python + FastAPI:** RAG & Gemini vector operations (\`http://localhost:8000/api/v1\`)
- **Qdrant Vector Database:** Semantic document embeddings
- **PostgreSQL:** Student accounts and relational metadata

Configure URLs in \`.env\`:
\`\`\`env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8000/api/v1
\`\`\`
*Note: If the backend services are not running, the frontend gracefully falls back to local simulated mock services with full interactivity.*

