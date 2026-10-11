export const demoAnswers = [
  { label: 'Scholarship Renewal Docs', question: 'What documents are required for scholarship renewal?', title: 'Here’s what you need for your scholarship renewal:', bullets: ['Previous semester marksheet', 'Current academic year fee receipt', 'Valid income certificate', 'Aadhaar card & bank passbook copy'], note: 'Submit the documents to the scholarship office after checking the latest renewal notice.', sources: ['Scholarship_Notice_2026.pdf', 'Student_Guidelines.pdf'], confidence: '98.6%' },
  { label: 'DBMS Unit 3 Notes', question: 'Find me DBMS Unit 3 notes.', title: 'Your Unit 3 resources are ready.', bullets: ['Transactions: ACID properties and transaction states', 'Concurrency: serializability and locking protocols', 'Recovery: logs, checkpoints, and rollback', 'Practice: 12 previous-year transaction questions'], note: 'Start with ACID properties, then move on to concurrency control.', sources: ['DBMS_Unit_3_Notes.pdf', 'DBMS_Syllabus.pdf'], confidence: '99.2%' },
  { label: 'Hostel Fee Deadline', question: 'When is the hostel fee payment deadline?', title: 'The sample hostel circular lists the following:', bullets: ['Fee payment deadline: 30 October 2026', 'Pay through the student fee portal', 'Save your receipt and submit a copy to the hostel office', 'Contact the warden for extension requests'], note: 'This is an illustrative notice. Check your college’s official circular before making a payment.', sources: ['Hostel_Fee_Notice_2026.pdf'], confidence: '97.8%' },
  { label: 'Exam Study Schedule', question: 'Create a 2-hour DBMS exam prep plan.', title: 'Your focused 2-hour DBMS study plan:', bullets: ['0–30 min: revise transactions and ACID properties', '30–60 min: practice serializability and locking', '60–70 min: take a break', '70–100 min: solve previous-year questions', '100–120 min: self-quiz and review weak topics'], note: 'Prioritize understanding over memorization. You’ve got this!', sources: ['DBMS_Syllabus.pdf', 'DBMS_Unit_3_Notes.pdf'], confidence: '98.1%' },
];
export function matchDemoQuery(query: string) {
  const text = query.toLowerCase();
  if (/scholar|renew|document/.test(text)) return 0;
  if (/hostel|fee|deadline/.test(text)) return 2;
  if (/plan|schedule|hour|exam/.test(text)) return 3;
  if (/dbms|notes|transaction/.test(text)) return 1;
  return -1;
}
