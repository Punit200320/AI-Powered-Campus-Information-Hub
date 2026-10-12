import { describe, expect, it } from 'vitest';
import { demoAnswers, matchDemoQuery } from '@/lib/campus-demo';

describe('CampusAI sample query selection', () => {
  it('selects scholarship renewal documents', () => {
    expect(demoAnswers[matchDemoQuery('What documents are required for scholarship renewal?')]?.sources).toEqual(['Scholarship_Notice_2026.pdf', 'Student_Guidelines.pdf']);
  });
  it('selects DBMS Unit 3 resources', () => {
    expect(matchDemoQuery('Give me DBMS notes for Unit 3')).toBe(1);
  });
  it('selects the two-hour exam preparation plan', () => {
    const answer = demoAnswers[matchDemoQuery('Generate 2-hour exam prep plan')];
    expect(answer?.bullets.at(-1)).toBe('100–120 min: self-quiz and review weak topics');
  });
  it('does not fabricate answers for unsupported topics', () => {
    expect(matchDemoQuery('Where is the chemistry building?')).toBe(-1);
  });
});