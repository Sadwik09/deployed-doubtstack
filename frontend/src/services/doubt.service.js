import api from "./api";

export const doubtService = {
  // Get all doubts with filters
  getDoubts: async (params = {}) => {
    const response = await api.get("/doubts", { params });
    return response.data;
  },

  // Get doubt by ID
  getDoubtById: async (id) => {
    const response = await api.get(`/doubts/${id}`);
    return response.data;
  },

  // Create new doubt
  createDoubt: async (doubtData) => {
    const response = await api.post("/doubts", doubtData);
    return response.data;
  },

  // Update doubt
  updateDoubt: async (id, doubtData) => {
    const response = await api.put(`/doubts/${id}`, doubtData);
    return response.data;
  },

  // Delete doubt
  deleteDoubt: async (id) => {
    const response = await api.delete(`/doubts/${id}`);
    return response.data;
  },

  // Mark doubt as resolved
  resolveDoubt: async (id) => {
    const response = await api.put(`/doubts/${id}/resolve`);
    return response.data;
  },

  // Vote on doubt
  voteDoubt: async (id, voteType) => {
    const response = await api.post(`/doubts/${id}/vote`, { voteType });
    return response.data;
  },

  // Follow/unfollow doubt
  followDoubt: async (id) => {
    const response = await api.post(`/doubts/${id}/follow`);
    return response.data;
  },
};
