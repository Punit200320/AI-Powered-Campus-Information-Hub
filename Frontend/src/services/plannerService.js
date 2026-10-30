import { MOCK_STUDY_PLANNER } from '../data/mockData';

export const plannerService = {
  getPlannerData: async () => {
    return { ...MOCK_STUDY_PLANNER };
  },

  optimizeScheduleWithAI: async (currentTasks) => {
    // Simulates an AI rearrangement prioritizing weak topics and highest leverage study hours
    await new Promise((r) => setTimeout(r, 600));
    return currentTasks.map((task, index) => {
      if (task.priority === 'high') {
        return { ...task, time: index === 0 ? '08:00 AM - 09:30 AM (Peak Focus)' : task.time };
      }
      return task;
    });
  },
};

export default plannerService;

