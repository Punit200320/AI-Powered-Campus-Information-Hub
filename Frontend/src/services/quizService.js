import { aiClient } from './api';
import { MOCK_QUIZ_SUBJECTS, MOCK_QUESTIONS } from '../data/mockData';

export const quizService = {
  getSubjects: () => MOCK_QUIZ_SUBJECTS,

  generateQuiz: async ({ subjectId, unit, difficulty = 'Medium', count = 5 }) => {
    try {
      const response = await aiClient.post('/quiz/generate', {
        subjectId,
        unit,
        difficulty,
        count,
      });
      return response.data;
    } catch (err) {
      // Mock question retrieval
      const questionsForUnit = MOCK_QUESTIONS[unit] || MOCK_QUESTIONS['Unit 3: Graph Algorithms (Dijkstra, MST)'];
      return {
        quizId: `quiz_${Date.now()}`,
        subject: subjectId,
        unit,
        difficulty,
        questions: questionsForUnit.slice(0, count),
      };
    }
  },
};

export default quizService;

