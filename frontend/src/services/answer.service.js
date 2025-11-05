import api from './api';

export const answerService = {
  // Create new answer
  createAnswer: async (doubtId, answerData) => {
    const response = await api.post(`/answers/doubts/${doubtId}`, answerData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update answer
  updateAnswer: async (id, content) => {
    const response = await api.put(`/answers/${id}`, { content });
    return response.data;
  },

  // Delete answer
  deleteAnswer: async (id) => {
    const response = await api.delete(`/answers/${id}`);
    return response.data;
  },

  // Vote on answer
  voteAnswer: async (id, voteType) => {
    const response = await api.post(`/answers/${id}/vote`, { voteType });
    return response.data;
  },

  // Accept answer
  acceptAnswer: async (id) => {
    const response = await api.post(`/answers/${id}/accept`);
    return response.data;
  },

  // Verify answer (faculty only)
  verifyAnswer: async (id) => {
    const response = await api.post(`/answers/${id}/verify`);
    return response.data;
  }
};
