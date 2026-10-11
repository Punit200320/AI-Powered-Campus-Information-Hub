import { useEffect, useState } from 'react';
import {
  ArrowUp,
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  FileText,
  GraduationCap,
  LayoutGrid,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Timer,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { demoAnswers, matchDemoQuery } from '@/lib/campus-demo';

export function CampusDemo({ playground = false }: { playground?: boolean }) {
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [source, setSource] = useState<string | null>(null);
  const [unsupported, setUnsupported] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const answer = demoAnswers[active] ?? demoAnswers[0];

  useEffect(() => {
    if (!busy) return;
    const timer = setTimeout(() => setBusy(false), 600);
    return () => clearTimeout(timer);
  }, [busy, active]);

  function select(index: number) {
    setActive(index);
    setUnsupported(false);
    setBusy(true);
    setCopied(false);
    setFeedback(null);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    const result = matchDemoQuery(query);
    if (result < 0) {
      setUnsupported(true);
      return;
    }
    select(result);
    setQuery('');
  }

  function handleCopy() {
    if (!answer) return;
    const text = `${answer.title}\n${answer.bullets.map((b) => `• ${b}`).join('\n')}\n${answer.note}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!answer) return null;

  return (
    <>
      {playground && (
        <div className="demo-tabs" role="tablist" aria-label="Sample campus questions">
          {demoAnswers.map((item, i) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={active === i}
              className={`demo-tab-btn ${active === i ? 'active' : ''}`}
              onClick={() => select(i)}
            >
              <Sparkles size={13} className="tab-spark" />
              <span>{item.label}</span>
              {active === i && <span className="tab-active-dot" />}
            </button>
          ))}
        </div>
      )}

      <div className={`campus-window ${playground ? 'playground-window' : ''}`}>
        {/* Window Chrome Header */}
        <div className="window-bar">
          <div className="window-dots">
            <i aria-label="Close" />
            <i aria-label="Minimize" />
            <i aria-label="Expand" />
          </div>
          <div className="window-url">
            <ShieldCheck size={13} className="text-primary" />
            <span>campusai.app</span>
            <span className="window-badge">ssl-verified</span>
          </div>
          <div className="window-status-pill">
            <span className="status-ping" />
            <span>Interactive Demo</span>
          </div>
        </div>

        {/* Window Body */}
        <div className="window-body">
          {/* Left App Sidebar */}
          <aside className="demo-sidebar">
            <div className="demo-brand">
              <div className="demo-brand-icon">
                <GraduationCap size={18} />
              </div>
              <div className="demo-brand-title">
                CampusAI <span className="beta-tag">v2.4</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="new-chat-btn"
              onClick={() => {
                setQuery('');
                select(0);
              }}
            >
              <Plus size={14} /> New inquiry
            </Button>

            <div className="sidebar-label">CAMPUS WORKSPACE</div>
            <nav className="sidebar-nav">
              <button
                type="button"
                className={`sidebar-nav-item ${active === 0 ? 'selected' : ''}`}
                onClick={() => select(0)}
              >
                <Sparkles size={15} />
                <span>AI Assistant</span>
                <span className="sidebar-chip">RAG</span>
              </button>
              <button
                type="button"
                className={`sidebar-nav-item ${active === 1 ? 'selected' : ''}`}
                onClick={() => select(1)}
              >
                <BookOpen size={15} />
                <span>Course Syllabi</span>
                <span className="sidebar-chip">15+</span>
              </button>
              <button
                type="button"
                className={`sidebar-nav-item ${active === 3 ? 'selected' : ''}`}
                onClick={() => select(3)}
              >
                <LayoutGrid size={15} />
                <span>Study Planner</span>
              </button>
            </nav>

            <div className="sidebar-label mt-5">SAVED INQUIRIES</div>
            <div className="sidebar-recents">
              <button
                type="button"
                className={`sidebar-recent-link ${active === 0 ? 'active' : ''}`}
                onClick={() => select(0)}
              >
                <MessageSquare size={13} />
                <span className="truncate">Scholarship renewal</span>
              </button>
              <button
                type="button"
                className={`sidebar-recent-link ${active === 1 ? 'active' : ''}`}
                onClick={() => select(1)}
              >
                <MessageSquare size={13} />
                <span className="truncate">DBMS Unit 3 notes</span>
              </button>
              <button
                type="button"
                className={`sidebar-recent-link ${active === 2 ? 'active' : ''}`}
                onClick={() => select(2)}
              >
                <MessageSquare size={13} />
                <span className="truncate">Hostel fee circular</span>
              </button>
            </div>

            <div className="sidebar-profile">
              <div className="profile-avatar">AS</div>
              <div className="profile-info">
                <strong>Alex Sharma</strong>
                <small>B.Tech CSE · Sem 4</small>
              </div>
            </div>
          </aside>

          {/* Main Chat Interface */}
          <div className="demo-main">
            <div className="demo-top">
              <div className="demo-top-left">
                <div className="ai-status-indicator">
                  <Sparkles size={14} className="text-primary" />
                </div>
                <div>
                  <span className="demo-top-title">Academic Knowledge Assistant</span>
                  <span className="demo-top-sub">Grounded in institutional records</span>
                </div>
              </div>
              <div className="demo-top-meta">
                <span className="online-tag">
                  <i className="online-pulse" /> Vector index active
                </span>
              </div>
            </div>

            <div className="conversation">
              {/* Student Query Message */}
              <div className="question-bubble-wrap">
                <div className="profile-avatar question-avatar">AS</div>
                <div className="question-content">
                  <div className="question-header">
                    <span className="question-sender">Alex Sharma</span>
                    <span className="question-time">Just now</span>
                  </div>
                  <div className="question-text">{answer.question}</div>
                </div>
              </div>

              {/* AI Answer Message */}
              <div className="answer-bubble-wrap">
                <div className="ai-avatar">
                  <Sparkles size={16} />
                </div>
                <div className="answer-content">
                  <div className="answer-header">
                    <div className="answer-title-group">
                      <span className="answer-name">CampusAI</span>
                      <span className="verified-badge">
                        <ShieldCheck size={12} /> Institutional Source Grounded
                      </span>
                    </div>
                    <div className="answer-actions">
                      <button
                        type="button"
                        className="answer-action-btn"
                        onClick={handleCopy}
                        title="Copy answer"
                      >
                        {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        type="button"
                        className={`answer-action-btn ${feedback === 'up' ? 'active-feedback' : ''}`}
                        onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                        title="Helpful"
                      >
                        <ThumbsUp size={13} />
                      </button>
                      <button
                        type="button"
                        className={`answer-action-btn ${feedback === 'down' ? 'active-feedback' : ''}`}
                        onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                        title="Needs improvement"
                      >
                        <ThumbsDown size={13} />
                      </button>
                    </div>
                  </div>

                  <div aria-live="polite" className="response-space">
                    {busy ? (
                      <div className="thinking-container">
                        <div className="thinking-spinner">
                          <Sparkles size={18} className="animate-spin text-primary" />
                        </div>
                        <div className="thinking-text">
                          <strong>Retrieving campus circulars & syllabi...</strong>
                          <p>Synthesizing verified references via RAG pipeline</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="answer-lead">{answer.title}</h4>
                        <ul className="answer-bullet-list">
                          {answer.bullets.map((item) => (
                            <li key={item} className="answer-bullet-item">
                              <span className="bullet-icon-box">
                                <Check size={13} className="text-success" />
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="answer-tip-box">
                          <span className="tip-badge">Note</span>
                          <span className="tip-text">{answer.note}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Sources Chips */}
                  <div className="sources-section">
                    <div className="sources-header">
                      <span className="sources-label">CITED DOCUMENTS</span>
                      <span className="sources-count">({answer.sources.length} institutional files)</span>
                    </div>
                    <div className="source-pills">
                      {answer.sources.map((item, i) => (
                        <button
                          type="button"
                          className="source-pill-btn"
                          key={item}
                          onClick={() => setSource(item)}
                        >
                          <FileText size={13} className="source-icon" />
                          <span className="source-filename">{item}</span>
                          <span className="source-index-tag">[{i + 1}]</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Answer Status Footer */}
                  <div className="answer-status-bar">
                    <div className="status-confidence">
                      <ShieldCheck size={13} />
                      <span>{answer.confidence} match confidence</span>
                    </div>
                    <div className="status-latency">
                      <Zap size={13} />
                      <span>&lt;180ms cached retrieval</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Cards in Hero */}
            {!playground && (
              <div className="quick-action-strip">
                <button
                  type="button"
                  className={`quick-card ${active === 1 ? 'selected' : ''}`}
                  onClick={() => select(1)}
                >
                  <div className="quick-card-icon blue">
                    <BookOpen size={16} />
                  </div>
                  <div className="quick-card-text">
                    <strong>DBMS — Unit 3 Notes</strong>
                    <small>Transactions, ACID & Concurrency</small>
                  </div>
                  <ChevronRight size={15} className="quick-chevron" />
                </button>
                <button
                  type="button"
                  className={`quick-card ${active === 3 ? 'selected' : ''}`}
                  onClick={() => select(3)}
                >
                  <div className="quick-card-icon mint">
                    <Timer size={16} />
                  </div>
                  <div className="quick-card-text">
                    <strong>2-Hour Exam Prep Plan</strong>
                    <small>Smart syllabus-aligned schedule</small>
                  </div>
                  <ChevronRight size={15} className="quick-chevron" />
                </button>
              </div>
            )}

            {/* Search Input Bar */}
            <form className="demo-search-bar" onSubmit={submit}>
              <div className="search-bar-inner">
                <Search size={16} className="search-icon" />
                <input
                  aria-label={playground ? 'Playground campus question' : 'Campus question'}
                  placeholder="Ask anything (e.g. 'scholarship renewal', 'DBMS notes', 'hostel fee')..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query.trim() && (
                  <button
                    type="button"
                    className="clear-query-btn"
                    onClick={() => setQuery('')}
                    title="Clear"
                  >
                    ×
                  </button>
                )}
                <Button
                  size="sm"
                  type="submit"
                  className="send-query-btn"
                  disabled={busy || !query.trim()}
                  aria-label="Send inquiry"
                >
                  <ArrowUp size={15} />
                </Button>
              </div>
            </form>

            {unsupported && (
              <div className="unsupported-alert" role="status">
                <span className="unsupported-dot" />
                <span>
                  Demo preview responds to <strong>scholarships</strong>, <strong>DBMS notes</strong>,{' '}
                  <strong>hostel fees</strong>, or <strong>study schedules</strong>. Click any topic above!
                </span>
              </div>
            )}

            {/* Suggested Follow-up Chips */}
            <div className="suggested-chips">
              <span className="suggested-label">Try asking:</span>
              <button type="button" className="prompt-chip" onClick={() => select(0)}>
                Scholarship Renewal
              </button>
              <button type="button" className="prompt-chip" onClick={() => select(1)}>
                DBMS Unit 3 Notes
              </button>
              <button type="button" className="prompt-chip" onClick={() => select(2)}>
                Hostel Fee Deadline
              </button>
              <button type="button" className="prompt-chip" onClick={() => select(3)}>
                2-Hour Study Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Source Document Excerpt Modal */}
      <Dialog
        open={source !== null}
        onOpenChange={(open) => {
          if (!open) setSource(null);
        }}
      >
        <DialogContent className="source-modal-dialog">
          <div className="modal-header-strip">
            <div className="modal-icon-wrap">
              <FileText size={20} />
            </div>
            <div>
              <DialogTitle className="modal-title break-all">{source}</DialogTitle>
              <DialogDescription className="modal-subtitle">
                Institutional Circular Reference · Institutional Repository Preview
              </DialogDescription>
            </div>
          </div>

          <div className="modal-document-preview">
            <div className="doc-meta-badge">
              <span className="doc-tag">VERIFIED ARCHIVE</span>
              <span className="doc-pages">Confidence: {answer.confidence}</span>
            </div>
            <h4 className="doc-section-title">{answer.label}</h4>
            <ul className="doc-bullet-list">
              {answer.bullets.map((item) => (
                <li key={item}>
                  <Check size={14} className="text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="doc-note-box">
              <strong>Official Note:</strong> {answer.note}
            </div>
          </div>

          <div className="modal-footer-notice">
            <ShieldCheck size={13} className="text-primary" />
            <span>Illustrative document preview for evaluation. No live student credentials required.</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
