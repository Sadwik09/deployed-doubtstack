import api from "./api";

export const userService = {
  // Get user profile
  getUserProfile: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's doubts
  getUserDoubts: async (id, params = {}) => {
    try {
      const response = await api.get(`/users/${id}/doubts`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's answers
  getUserAnswers: async (id, params = {}) => {
    try {
      const response = await api.get(`/users/${id}/answers`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const leaderboardService = {
  // Get leaderboard
  getLeaderboard: async (params = {}) => {
    try {
      const response = await api.get("/leaderboard", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get platform stats
  getPlatformStats: async () => {
    try {
      const response = await api.get("/leaderboard/stats");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const tagService = {
  // Get all tags
  getTags: async (params = {}) => {
    try {
      const response = await api.get("/tags", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get tag suggestions
  getSuggestTags: async (query) => {
    try {
      const response = await api.get("/tags/suggest", { params: { query } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
