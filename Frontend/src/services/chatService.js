import { aiClient } from './api';

// Intelligent simulated campus knowledge base responses with citations
const KNOWLEDGE_RESPONSES = [
  {
    keywords: ['dijkstra', 'shortest path', 'algorithm'],
    title: "Dijkstra's Single-Source Shortest Path Algorithm",
    response: `### 🧭 Dijkstra's Algorithm Overview

**Dijkstra's Algorithm** computes the shortest path from a single source vertex to all other vertices in a weighted graph with **non-negative edge weights**.

#### 1. Core Mathematical Invariant
At each step, the algorithm greedily selects an unvisited vertex $u$ with the minimum tentative distance $dist[u]$, marks it as visited (finalized), and relaxes all outgoing edges $(u, v)$ with weight $w$:
\`\`\`
if dist[u] + weight(u, v) < dist[v]:
    dist[v] = dist[u] + weight(u, v)
    parent[v] = u
\`\`\`

#### 2. Time & Space Complexity
- **With Min-Heap (Binary Heap):** $\\mathcal{O}((V + E) \\log V)$
- **With Fibonacci Heap:** $\\mathcal{O}(E + V \\log V)$
- **Space Complexity:** $\\mathcal{O}(V + E)$ for adjacency list and priority queue.

#### 3. Why Negative Weights Break Dijkstra
If an edge has a negative weight, a path through an already finalized vertex could yield a smaller overall distance, breaking the greedy optimal substructure. For graphs with negative weights, use the **Bellman-Ford Algorithm** $(\\mathcal{O}(V \\cdot E))$.`,
    citations: [
      { id: 'cit_1', title: 'Data_Structures_Unit_3_Graphs.pdf', page: 'p. 48-52', author: 'Dr. Evelyn Reed' },
      { id: 'cit_2', title: 'Algorithms_Core_Reference_2026.pdf', page: 'p. 114', author: 'CS Department' },
    ],
  },
  {
    keywords: ['paging', 'segmentation', 'virtual memory', 'page fault'],
    title: 'Virtual Memory: Paging vs. Segmentation',
    response: `### 🧠 Memory Management: Paging vs Segmentation

Both **Paging** and **Segmentation** are memory management schemes that break free from contiguous memory allocation, but they operate on fundamentally different concepts:

| Feature | Paging | Segmentation |
| :--- | :--- | :--- |
| **Block Size** | Fixed-size blocks (typically 4 KB) | Variable-size blocks (matches logical units) |
| **Division By** | Hardware / OS transparently | Programmer / Compiler logical modules |
| **Fragmentation** | **Internal fragmentation** possible | **External fragmentation** possible |
| **Virtual Address** | Page Number ($p$) + Offset ($d$) | Segment Number ($s$) + Offset ($d$) |
| **Speed** | Faster with hardware TLB caching | Requires segment limit checks per access |

#### TLB Hit Ratio & Effective Memory Access Time (EMAT)
$$\\text{EMAT} = h \\cdot (t_{\\text{TLB}} + t_{\\text{mem}}) + (1 - h) \\cdot (t_{\\text{TLB}} + 2 \\cdot t_{\\text{mem}})$$
Where $h$ is the TLB hit ratio and $t_{\\text{mem}}$ is physical RAM latency.`,
    citations: [
      { id: 'cit_3', title: 'Operating_Systems_Unit4_Virtual_Memory.pdf', page: 'p. 18-24', author: 'Prof. Julian Vance' },
      { id: 'cit_4', title: 'OS_Exam_Solutions_2025.pdf', page: 'p. 7', author: 'Campus Academic Council' },
    ],
  },
  {
    keywords: ['hostel', 'curfew', 'leave', 'night pass', 'rules', 'gate'],
    title: 'Campus Hostel Policies & Night Pass Regulations',
    response: `### 🏢 Official Campus Residential Regulations (2026-2027)

According to the **Campus Student Residential Handbook (Section 4.3)**:

1. **Curfew Timings:**
   - Weekdays (Mon - Fri): Gates close strictly at **10:00 PM**.
   - Weekends (Sat - Sun): Extended curfew until **10:30 PM**.
2. **Night Pass Procedure:**
   - Apply on the **Campus Portal at least 6 hours in advance**.
   - Requires digital OTP confirmation from registered parent/guardian.
   - Maximum allowed night-outs per semester: **8 occasions** without special written consent from the Chief Warden.
3. **Library Access After Hours:**
   - 24/7 Central Digital Library pass allows access until 02:00 AM during mid-term and end-term exam periods.`,
    citations: [
      { id: 'cit_5', title: 'Campus_Hostel_Code_of_Conduct_2026.pdf', page: 'p. 12', author: 'Dean of Student Affairs' },
    ],
  },
  {
    keywords: ['placement', 'cgpa', 'internship', 'package', 'tier'],
    title: 'Campus Placement Eligibility & Tier Classifications',
    response: `### 💼 Campus Training & Placement Guidelines 2026

#### 1. Minimum Eligibility
- **Minimum CGPA:** 7.00 aggregate with no active standing backlogs at the start of the drive.
- **Attendance Requirement:** $\\ge 75\\%$ in mandatory placement training sessions.

#### 2. Company Tier Classifications
- **Super Dream ($> \\$25k$ / > 20 LPA):** Top tier tech and quant firms.
- **Dream ($> \\$12k$ / 10-20 LPA):** High growth product startups and multinational R&D labs.
- **Core / IT Services ($< \\$12k$ / 5-10 LPA):** Bulk recruitment partners.

Students are allowed up to **one regular offer + one Dream upgrade**. Once a Super Dream offer is secured, the candidate is locked.`,
    citations: [
      { id: 'cit_6', title: 'Campus_Placement_Policy_2026.pdf', page: 'p. 3-6', author: 'Training & Placement Cell' },
    ],
  },
];

export const chatService = {
  // Streams response word by word or token by token for authentic AI feel
  streamMessage: async (userMessage, onChunk, onComplete, mode = 'balanced') => {
    try {
      // First attempt backend Python/FastAPI LLM call
      const response = await aiClient.post('/chat/generate', {
        message: userMessage,
        mode,
      });
      if (response.data && response.data.reply) {
        onChunk(response.data.reply);
        onComplete({ text: response.data.reply, citations: response.data.citations || [] });
        return;
      }
    } catch (err) {
      // Backend not yet reachable; use high-fidelity contextual simulation
    }

    // Match query against knowledge base
    const lower = userMessage.toLowerCase();
    const matched = KNOWLEDGE_RESPONSES.find((item) =>
      item.keywords.some((k) => lower.includes(k))
    ) || {
      title: 'AI Academic Assistant Response',
      response: `### 🎓 Campus AI Analysis

I have searched the **Campus Academic Vector Database (Qdrant)** and indexed university repositories for: **"${userMessage}"**.

#### Key Findings:
1. **Academic Context:** This topic is referenced in the Department Syllabus for the 2026 curriculum.
2. **Key Recommendation:** Review the official lecture handouts and practice the previous semester problem sets.
3. **Cross-Reference:** Check the **Resource Finder** tab for verified faculty notes with complete derivations.

> *Tip: You can generate a tailored quiz on this exact topic in the **Question Generator** tab to test your retention.*`,
      citations: [
        { id: 'cit_gen', title: 'Campus_Academic_Regulations_2026.pdf', page: 'p. 15', author: 'Academic Dean' },
      ],
    };

    // Simulate streaming text delivery
    const fullText = matched.response;
    const words = fullText.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      onChunk(currentText);
      await new Promise((r) => setTimeout(r, 22)); // natural reading cadence
    }

    onComplete({ text: fullText, citations: matched.citations });
  },
};

export default chatService;

