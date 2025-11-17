import api from './api';

const aiService = {
  // Chat with Claude AI
  async chat(message, context = null, conversationId = null, repoFullName = null) {
    const response = await api.post('/api/ai/chat', {
      message,
      context,
      conversationId,
      repoFullName,
    });
    return response.data;
  },

  // Analyze code
  async analyzeCode(code, language = null, question = null) {
    const response = await api.post('/api/ai/analyze-code', {
      code,
      language,
      question,
    });
    return response.data;
  },

  // Summarize commits
  async summarizeCommits(commits) {
    const response = await api.post('/api/ai/summarize-commits', {
      commits,
    });
    return response.data;
  },

  // Review pull request
  async reviewPR(title, body, diff) {
    const response = await api.post('/api/ai/review-pr', {
      title,
      body,
      diff,
    });
    return response.data;
  },

  // Get conversation history
  async getConversation(conversationId) {
    const response = await api.get(`/api/ai/conversations/${conversationId}`);
    return response.data;
  },

  // Get all conversations
  async getConversations() {
    const response = await api.get('/api/ai/conversations');
    return response.data;
  },
};

export default aiService;
