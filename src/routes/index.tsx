import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  CircleHelp,
  Database,
  FileCheck2,
  FileSearch,
  FileText,
  GitBranch,
  GraduationCap,
  Layers,
  ListChecks,
  MessageSquare,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CampusDemo } from '@/components/campus/demo';
import { Brand, Navigation, navigation } from '@/components/campus/navigation';
import campusImage from '@/assets/campus.jpg';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'CampusAI — Your Intelligent Campus Assistant & Resource Finder' },
      {
        name: 'description',
        content:
          'Find academic resources, understand college notices, and plan your studies with CampusAI. Explore an institutional AI campus assistant with verified source citations.',
      },
      { property: 'og:title', content: 'CampusAI — Your Entire Campus, One Intelligent Assistant' },
      {
        property: 'og:description',
        content:
          'Smarter resource discovery, cited campus answers, and personalized study planning, built for students.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: CampusLanding,
});

const problems = [
  {
    icon: FileSearch,
    title: 'Notices, Not Noise.',
    tag: 'Notice Overload',
    problem: 'Crucial college circulars get lost in chaotic WhatsApp groups, bulletin boards, and unindexed 50-page PDFs.',
    solution: 'Instant notice synthesis & deadline extraction with exact PDF citations',
    color: '',
  },
  {
    icon: BookOpen,
    title: 'The Right Notes. Instantly.',
    tag: 'Fragmented Notes',
    problem: 'Relevant unit notes, syllabus weightage, and previous-year exam papers are scattered across fragmented drives.',
    solution: 'Trie-indexed syllabus discovery finding the right topic in <50ms',
    color: 'blue',
  },
  {
    icon: Timer,
    title: 'Less Cramming. More Clarity.',
    tag: 'Exam Anxiety',
    problem: 'Two nights before midterms, students waste hours trying to figure out which units carry maximum syllabus marks.',
    solution: 'Prioritized study plans tailored to available hours & unit weightage',
    color: 'mint',
  },
  {
    icon: MessageSquare,
    title: 'Ask Once. Get Verified Truth.',
    tag: 'Administrative Delays',
    problem: 'Identical administrative queries (hostel fees, scholarship forms, attendance rules) wait days for office replies.',
    solution: 'LRU-cached RAG answering common questions with sub-second verified replies',
    color: 'peach',
  },
];

const features = [
  {
    icon: MessageSquare,
    label: 'RAG CAMPUS ASSISTANT',
    title: 'Answers you can actually trust & verify.',
    body: 'Ask in your own words. Receive precise answers grounded in college circulars, syllabus notices, and university guidelines. Every answer carries an inspectable citation.',
    tags: ['Institutional RAG', 'Inspectable Citations', 'Zero Hallucination'],
    art: 'chat',
  },
  {
    icon: FileText,
    label: 'SMART CIRCULAR SUMMARIZER',
    title: '50-page circulars condensed into 30 seconds.',
    body: 'Never miss a scholarship or exam registration deadline again. CampusAI parses convoluted bureaucratic notifications into clean bullet points.',
    tags: ['Key Deadlines', 'Eligibility Criteria', 'Required Checklist'],
    art: 'pdf',
  },
  {
    icon: ListChecks,
    label: 'SYLLABUS MCQ & QUIZ GENERATOR',
    title: 'Turn unit notes into active recall practice.',
    body: 'Generate syllabus-aligned multiple-choice questions directly from your professor’s unit slides. Test your understanding before exam week.',
    tags: ['Unit-Specific', 'Instant Explanations', 'Mistake Analysis'],
    art: 'quiz',
  },
  {
    icon: Timer,
    label: 'PERSONALIZED STUDY PLANNER',
    title: 'A schedule mapped to marks & your clock.',
    body: 'Enter your available hours and target subjects. Get a structured revision schedule weighted by syllabus importance and high-probability topics.',
    tags: ['Weightage Prioritized', 'Time-Block Scheduling', 'Progress Tracking'],
    art: 'plan',
  },
];

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

// Interactive Feature Art Components
function InteractiveQuizArt() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="quiz-art">
      <div>
        <span>PRACTICE QUESTION · UNIT 3</span>
        <small>DBMS · Transactions</small>
      </div>
      <strong>Which ACID property guarantees that all transaction operations complete or none do?</strong>
      <div className="quiz-options">
        <button
          type="button"
          className={`quiz-option-btn ${selected === 0 ? 'correct' : ''}`}
          onClick={() => setSelected(0)}
        >
          <span>A</span> Consistency
        </button>
        <button
          type="button"
          className={`quiz-option-btn ${selected === 1 ? 'correct' : ''}`}
          onClick={() => setSelected(1)}
        >
          <span>B</span> Atomicity {selected === 1 && <Check size={14} className="ml-auto" />}
        </button>
        <button
          type="button"
          className={`quiz-option-btn ${selected === 2 ? 'correct' : ''}`}
          onClick={() => setSelected(2)}
        >
          <span>C</span> Isolation
        </button>
      </div>
      {selected === 1 && (
        <div className="quiz-feedback-text">
          ✓ Correct! Atomicity ensures the all-or-nothing execution rule.
        </div>
      )}
      {selected !== null && selected !== 1 && (
        <div className="text-xs text-muted-foreground mt-2">
          Hint: Try Option B (Atomicity prevents partial writes).
        </div>
      )}
    </div>
  );
}

function InteractivePlanArt() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({ '0': true });

  const tasks = [
    { time: '30 min', topic: 'Transactions & ACID properties' },
    { time: '40 min', topic: 'Concurrency control & Serializability' },
    { time: '50 min', topic: 'Previous-Year Exam Question Practice' },
  ];

  function toggle(idx: string) {
    setCompleted((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  return (
    <div className="plan-art">
      <div>
        <Timer size={16} />
        <strong>2-Hour Evening Sprint</strong>
        <span className="plan-art-badge">
          {Object.values(completed).filter(Boolean).length}/3 Done
        </span>
      </div>
      <div className="plan-art-tasks">
        {tasks.map((task, i) => (
          <button
            key={task.topic}
            type="button"
            className={`plan-task-item ${completed[i] ? 'completed' : ''}`}
            onClick={() => toggle(String(i))}
          >
            <span className="plan-time">{task.time}</span>
            <span>{task.topic}</span>
            {completed[i] && <Check size={14} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function InteractivePdfArt() {
  const [activeTab, setActiveTab] = useState<'dates' | 'eligibility' | 'docs'>('dates');

  return (
    <div className="pdf-art">
      <div className="pdf-sheet">
        <FileText size={32} />
        <span>Circular.pdf</span>
        <small>50 pages</small>
      </div>
      <ArrowRight size={22} className="text-muted-foreground shrink-0" />
      <div className="pdf-summary">
        <strong>
          <Sparkles size={14} /> AI Synthesis
        </strong>
        <div className="flex gap-1 mb-2">
          <button
            type="button"
            onClick={() => setActiveTab('dates')}
            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${activeTab === 'dates' ? 'bg-primary text-white border-primary' : 'bg-muted text-muted-foreground'}`}
          >
            Dates
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('eligibility')}
            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${activeTab === 'eligibility' ? 'bg-primary text-white border-primary' : 'bg-muted text-muted-foreground'}`}
          >
            Eligibility
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('docs')}
            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${activeTab === 'docs' ? 'bg-primary text-white border-primary' : 'bg-muted text-muted-foreground'}`}
          >
            Documents
          </button>
        </div>
        {activeTab === 'dates' && (
          <span>
            <Check size={13} /> Last Submission: Oct 30, 2026
          </span>
        )}
        {activeTab === 'eligibility' && (
          <span>
            <Check size={13} /> Min 75% Attendance & SGPA ≥ 7.5
          </span>
        )}
        {activeTab === 'docs' && (
          <span>
            <Check size={13} /> Fee Receipt + Income Certificate
          </span>
        )}
      </div>
    </div>
  );
}

function CampusLanding() {
  return (
    <div id="top">
      <Navigation />
      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-glow-backdrop" aria-hidden="true" />
          <div className="hero-copy">
            <a href="#demo" className="announcement">
              <span className="announcement-dot" />
              Institutional AI Campus Assistant <Sparkles size={14} className="text-primary" />
              <ChevronDown size={14} className="-rotate-90 text-muted-foreground" />
            </a>

            <h1>
              Your Entire Campus Knowledge,
              <br />
              One <span className="gradient-text">Intelligent Assistant.</span>
            </h1>

            <p>
              Instantly find verified lecture notes, understand official university circulars,
              and build personalized study schedules. Everything in one source-backed interface.
            </p>

            <div className="hero-actions">
              <Button size="lg" className="cta-nav-btn text-base px-6 h-12" asChild>
                <a href="#demo">
                  Try Live Assistant <ArrowRight size={17} className="ml-1" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="text-base px-6 h-12" asChild>
                <a href="#how-it-works">
                  <span className="play-symbol">▷</span> See How It Works
                </a>
              </Button>
            </div>

            <div className="hero-trust">
              <span className="tiny-avatar">AS</span>
              <span className="tiny-avatar avatar-mint">RK</span>
              <span className="tiny-avatar avatar-peach">MP</span>
              <span className="trust-copy">
                Designed for students. Evaluated against institutional syllabi & notices.
              </span>
            </div>
          </div>

          {/* CENTERPIECE DEMO WINDOW */}
          <div className="hero-product">
            <CampusDemo />
            <div className="product-caption">
              <span>
                <ShieldCheck size={14} className="text-success" /> Source-backed answers
              </span>
              <i />
              <span>
                <Zap size={14} className="text-primary" /> &lt;180ms cached latency
              </span>
              <i />
              <span>
                <GraduationCap size={15} className="text-primary" /> Student-first design
              </span>
            </div>
          </div>
        </section>

        {/* METRICS STRIP */}
        <section className="metrics-band">
          <div className="metrics-inner">
            <div className="metrics-context">
              Less searching.
              <br />
              <strong>More learning.</strong>
              <small>SYSTEM PERFORMANCE TARGETS</small>
            </div>
            <div className="metric-stat">
              <strong>
                98<span>%</span>
              </strong>
              <p>Faster notice & deadline lookup</p>
            </div>
            <div className="metric-stat">
              <strong>
                15<span>+</span>
              </strong>
              <p>Academic department syllabi mapped</p>
            </div>
            <div className="metric-stat">
              <strong>
                &lt;180<span>ms</span>
              </strong>
              <p>Average cached query latency</p>
            </div>
            <div className="metrics-note">
              <ShieldCheck size={24} />
              <div>
                <strong>Institutionally Grounded</strong>
                <div className="text-xs text-muted-foreground">Every answer cites the circular source.</div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM & SOLUTION SECTION */}
        <section className="section-container problems">
          <SectionIntro
            eyebrow="CAMPUS LIFE, MINUS THE FRICTION"
            title="Stop searching everywhere. Start finding answers."
            description="Your next academic answer shouldn’t require digging through 10 WhatsApp groups, scattered PDF drives, and an administrative office trip."
          />
          <div className="problem-grid">
            {problems.map((item) => (
              <article className="problem-card" key={item.title}>
                <span className={`feature-icon ${item.color}`}>
                  <item.icon size={24} />
                </span>
                <span className="problem-tag-badge">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.problem}</p>
                <div className="solution">
                  <Check size={16} />
                  <span>{item.solution}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CORE FEATURES BENTO GRID */}
        <section id="features" className="features-section">
          <div className="section-container">
            <SectionIntro
              eyebrow="ONE UNIFIED PLATFORM"
              title="A little AI. A lot less academic friction."
              description="Everything you need to retrieve, understand, practice, and plan — thoughtfully connected for students."
            />
            <div className="features-grid">
              {features.map((item, i) => (
                <article className={`feature-card feature-${i}`} key={item.title}>
                  <div className="feature-copy">
                    <span className="eyebrow">
                      <item.icon size={15} />
                      {item.label}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    <div className="feature-tags">
                      {item.tags.map((tag) => (
                        <span key={tag}>
                          <Check size={13} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="feature-art" aria-hidden="true">
                    {item.art === 'chat' ? (
                      <div className="chat-art-wrap">
                        <div className="mini-question">Am I eligible for the 2026 merit scholarship?</div>
                        <div className="mini-answer">
                          <Sparkles size={18} />
                          <div>
                            <strong>Yes! You meet all listed criteria.</strong>
                            <div className="mini-lines" />
                            <span>
                              <ShieldCheck size={13} /> Scholarship Policy Notice 2026 · Page 4
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : item.art === 'pdf' ? (
                      <InteractivePdfArt />
                    ) : item.art === 'quiz' ? (
                      <InteractiveQuizArt />
                    ) : (
                      <InteractivePlanArt />
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PLAYGROUND / DEMO SECTION */}
        <section id="demo" className="section-container playground">
          <SectionIntro
            eyebrow="DON’T JUST TAKE OUR WORD FOR IT"
            title="Go ahead. Ask your campus assistant."
            description="Explore sample campus inquiries below. Click any prompt to inspect the verified AI answer, cited institutional files, and confidence breakdown."
          />
          <CampusDemo playground />
          <p className="demo-disclaimer">
            <CircleHelp size={14} className="text-primary" />
            Interactive preview using illustrative campus documents. Live AI endpoints and university SSO are simulated in this build.
          </p>
        </section>

        {/* ARCHITECTURE & ALGORITHMS SECTION */}
        <section id="architecture" className="architecture-section">
          <div className="section-container">
            <div className="architecture-heading">
              <div>
                <span className="eyebrow">UNDER THE HOOD</span>
                <h2>
                  Generative AI meets
                  <br />
                  intelligent CS engineering.
                </h2>
              </div>
              <p>
                Not just another generic LLM wrapper. A hybrid architecture combining prefix Tries,
                sub-millisecond LRU caching, vector similarity search, and RAG grounding.
              </p>
            </div>

            {/* Visual Pipeline Flow */}
            <div className="architecture-flow">
              <span>
                <MessageSquare size={18} /> 1. Student Query
              </span>
              <ArrowRight size={16} className="flow-arrow" />
              <span>
                <Zap size={18} /> 2. LRU Cache & Trie
              </span>
              <ArrowRight size={16} className="flow-arrow" />
              <span>
                <Database size={18} /> 3. Vector Embeddings
              </span>
              <ArrowRight size={16} className="flow-arrow" />
              <span>
                <BrainCircuit size={18} /> 4. Context Synthesis
              </span>
              <ArrowRight size={16} className="flow-arrow" />
              <span>
                <ShieldCheck size={18} /> 5. Cited Answer
              </span>
            </div>

            <div className="architecture-grid">
              {[
                {
                  icon: Search,
                  name: 'Trie Index',
                  badge: 'O(k) Lookup',
                  text: 'Prefix-based tree search delivers instantaneous autocomplete across unit notes and subject codes as students type.',
                  detail: 'dbms → Database Management Systems',
                },
                {
                  icon: GitBranch,
                  name: 'Prerequisite Graph',
                  badge: 'BFS / DFS Traversal',
                  text: 'Directed acyclic course graphs analyze prerequisites to suggest the most logical study progression before exams.',
                  detail: 'SQL → Normalization → Transactions',
                },
                {
                  icon: Layers,
                  name: 'Priority Queue',
                  badge: 'Heap Ranking',
                  text: 'Calculates dynamic resource ranking factoring in exam recency, syllabus weightage, and peer verification.',
                  detail: 'High-yield topics ranked top.',
                },
                {
                  icon: Zap,
                  name: 'LRU Cache',
                  badge: 'O(1) Access',
                  text: 'Caches answers for high-frequency queries like hostel deadlines and fee portals, eliminating duplicate LLM latency.',
                  detail: 'Cache Hit → Sub-180ms response',
                },
                {
                  icon: Database,
                  name: 'Vector DB + RAG',
                  badge: 'Cosine Similarity',
                  text: 'Official documents are chunked and embedded with semantic vectors to retrieve precise context before answering.',
                  detail: 'Grounding eliminates hallucinations.',
                },
              ].map((item) => (
                <article className="architecture-card" key={item.name}>
                  <div>
                    <item.icon size={22} />
                    <span className="arch-badge">{item.badge}</span>
                  </div>
                  <h3>{item.name}</h3>
                  <p>{item.text}</p>
                  <small>{item.detail}</small>
                </article>
              ))}
            </div>

            <p className="architecture-footnote">
              <Network size={15} /> Built for sub-second retrieval. Designed to scale across campus departments.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS / WORKFLOW */}
        <section id="how-it-works" className="section-container workflow">
          <SectionIntro
            eyebrow="COMPLEX ENGINE. SIMPLE EXPERIENCE."
            title="From fragmented files to clarity in 3 steps."
            description="How CampusAI bridges institutional archives with student success."
          />
          <div className="workflow-grid">
            {[
              {
                icon: FileText,
                title: '1. Connect Campus Knowledge',
                body: 'University circulars, unit slides, and department syllabi are vectorized and structured into accessible semantic indices.',
                number: '01',
              },
              {
                icon: BrainCircuit,
                title: '2. Query With Natural Language',
                body: 'Ask casually in everyday language. Algorithmic cache and semantic search retrieve the exact paragraphs matching your intent.',
                number: '02',
              },
              {
                icon: FileCheck2,
                title: '3. Receive Actionable Insights',
                body: 'Get a clean, verified answer complete with clickable PDF source citations, practice quizzes, and revision plans.',
                number: '03',
              },
            ].map((step) => (
              <article className="workflow-card" key={step.number}>
                <div className="workflow-top">
                  <span className="step-number">{step.number}</span>
                  <step.icon size={26} />
                  <ArrowRight size={20} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* RESOURCE FINDER PREVIEWS */}
        <section id="resources" className="resources-section">
          <div className="section-container">
            <div className="resources-heading">
              <div>
                <span className="eyebrow">POPULAR CURATED RESOURCES</span>
                <h2>Your academic resources are one click away.</h2>
              </div>
              <Button variant="outline" asChild>
                <a href="#demo">
                  Explore Library <ArrowRight size={15} className="ml-1" />
                </a>
              </Button>
            </div>
            <div className="resource-grid">
              {[
                {
                  title: 'DBMS — Unit 3 Notes',
                  sub: 'Transactions, ACID Properties & Concurrency Control',
                  meta: 'Computer Science · 24 pages · Verified',
                  icon: BookOpen,
                  color: 'blue',
                  target: 'demo',
                },
                {
                  title: 'Scholarship Renewal Guide',
                  sub: 'State & Central Merit Eligibility, Required Forms & Deadlines',
                  meta: 'Student Welfare · 8 pages · Official Notice',
                  icon: FileText,
                  color: '',
                  target: 'demo',
                },
                {
                  title: '2-Hour Exam Prep Sprint',
                  sub: 'High-Yield Syllabus Topics Structured for Night-Before Review',
                  meta: 'Smart Study Planner · Personalized',
                  icon: Timer,
                  color: 'mint',
                  target: 'demo',
                },
              ].map((r) => (
                <a className="resource-card" href={`#${r.target}`} key={r.title}>
                  <span className={`feature-icon ${r.color}`}>
                    <r.icon size={24} />
                  </span>
                  <small>{r.meta}</small>
                  <h3>{r.title}</h3>
                  <p>{r.sub}</p>
                  <span className="resource-link">
                    Preview In Assistant <ArrowRight size={15} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* PERSPECTIVES & TESTIMONIALS */}
        <section className="section-container testimonials">
          <SectionIntro
            eyebrow="BUILT AROUND STUDENT & FACULTY REALITIES"
            title="Less stress. More “I’ve got this.”"
            description="Real student pain points solved through thoughtful information design."
          />
          <div className="testimonial-grid">
            {[
              {
                quote:
                  '“Finding scholarship circulars used to mean searching through a dozen WhatsApp chat histories. Having the exact answer with page citations in one place saves hours of frustration.”',
                name: 'Ananya Sharma',
                role: 'Computer Science Student · Sem 4',
                initial: 'A',
              },
              {
                quote:
                  '“The study planner mapped directly to our syllabus weightage is a lifesaver. It cuts through the overwhelm and tells me exactly what to focus on during exam week.”',
                name: 'Rohan Verma',
                role: 'Mechanical Engineering Student · Sem 6',
                initial: 'R',
              },
              {
                quote:
                  '“Connecting students directly to verified circulars frees faculty from answering identical administrative questions daily, letting us focus on mentoring and research.”',
                name: 'Dr. Mehta',
                role: 'Department Head & Academic Coordinator',
                initial: 'M',
              },
            ].map((t, i) => (
              <article className="testimonial-card" key={t.name}>
                <div className="testimonial-stars">
                  {Array.from({ length: 5 }, (_, n) => (
                    <Star size={15} key={n} />
                  ))}
                </div>
                <blockquote>{t.quote}</blockquote>
                <div className="testimonial-person">
                  <span
                    className={`profile-avatar ${i === 1 ? 'avatar-mint' : i === 2 ? 'avatar-peach' : ''}`}
                  >
                    {t.initial}
                  </span>
                  <div>
                    <strong>{t.name}</strong>
                    <small>{t.role}</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="illustration-note">
            Illustrative student and faculty perspectives reflecting user research goals.
          </p>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="faq-section section-container">
          <div>
            <span className="eyebrow">COMMON INQUIRIES</span>
            <h2>
              Good questions.
              <br />
              Transparent answers.
            </h2>
            <p>Everything you need to know about CampusAI data privacy, accuracy, and rollout.</p>
            <span className="feature-icon">
              <CircleHelp size={28} />
            </span>
          </div>
          <div className="faq-list">
            {[
              [
                'Is student data kept confidential and private?',
                'Yes. This interactive preview operates entirely client-side without collecting student records or logging personal inquiries. Production deployments integrate with institutional SSO adhering to institutional data protection standards.',
              ],
              [
                'How does CampusAI eliminate AI hallucinations?',
                'Unlike standard chatbots, CampusAI utilizes strict Retrieval-Augmented Generation (RAG). Answers are constrained strictly to indexed circulars and handbooks, and every claim links to an inspectable source citation.',
              ],
              [
                'How do campus notices and circulars get updated?',
                'In live campus deployments, authorized administrative departments publish circulars to an institutional ingestion pipeline that automatically parses, chunks, and updates vector embeddings.',
              ],
              [
                'Can students access study plans and notes offline?',
                'Our planned progressive web app (PWA) client will cache downloaded unit notes and study schedules for offline revision, while live AI query synthesis will require connectivity.',
              ],
              [
                'Is CampusAI free for college students?',
                'All interactive demo features in this preview are completely free without requiring an account. Institutional rollout models will be handled via university library and academic licenses.',
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  <span>{q}</span>
                  <span className="faq-plus">+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CAMPUS CTA BANNER */}
        <section className="campus-cta">
          <img
            src={campusImage}
            width={1536}
            height={768}
            loading="lazy"
            alt="Students walking through a bright modern university campus"
          />
          <div className="campus-cta-overlay" />
          <div className="campus-cta-content">
            <span className="eyebrow">A SMARTER SEMESTER AWAITS</span>
            <h2>Ready to make campus life effortless?</h2>
            <p>Spend less time searching through fragmented drives. Spend more time mastering your subjects.</p>
            <Button size="lg" className="cta-nav-btn text-base px-8 h-12" asChild>
              <a href="#demo">
                Launch Live Assistant Demo <ArrowRight size={17} className="ml-1" />
              </a>
            </Button>
            <small>No registration or account required to test the preview.</small>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer section-container">
        <div className="footer-top">
          <div>
            <Brand />
            <p>
              Your institutional campus knowledge.
              <br />
              Connected, verified, and always within reach.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            {navigation.map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <a href="#top" className="back-top">
            Back to top <ArrowDown size={14} className="rotate-180" />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 CampusAI. Built for smarter student learning.</span>
          <div>
            <span>Crafted with</span>
            {['React 19', 'TypeScript', 'TanStack', 'Tailwind', 'Lucide'].map((tech) => (
              <span className="stack-badge" key={tech}>
                {tech}
              </span>
            ))}
          </div>
          <span className="footer-student">
            <GraduationCap size={15} /> Student-first innovation.
          </span>
        </div>
      </footer>
    </div>
  );
}
