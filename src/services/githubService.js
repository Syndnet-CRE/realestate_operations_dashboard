import api from './api';

const githubService = {
  // Get repository info
  async getRepository(owner, repo) {
    const response = await api.get(`/api/github/repos/${owner}/${repo}`);
    return response.data;
  },

  // Get repository contents/files
  async getContents(owner, repo, path = '') {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/contents/${path}`);
    return response.data;
  },

  // Get commits
  async getCommits(owner, repo, page = 1, perPage = 30) {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/commits`, {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  // Get single commit
  async getCommit(owner, repo, sha) {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/commits/${sha}`);
    return response.data;
  },

  // Get issues
  async getIssues(owner, repo, state = 'open', page = 1, perPage = 30) {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/issues`, {
      params: { state, page, per_page: perPage },
    });
    return response.data;
  },

  // Get single issue
  async getIssue(owner, repo, issueNumber) {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/issues/${issueNumber}`);
    return response.data;
  },

  // Create issue
  async createIssue(owner, repo, data) {
    const response = await api.post(`/api/github/repos/${owner}/${repo}/issues`, data);
    return response.data;
  },

  // Get pull requests
  async getPullRequests(owner, repo, state = 'open', page = 1, perPage = 30) {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/pulls`, {
      params: { state, page, per_page: perPage },
    });
    return response.data;
  },

  // Get single pull request
  async getPullRequest(owner, repo, pullNumber) {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/pulls/${pullNumber}`);
    return response.data;
  },

  // Get contributors
  async getContributors(owner, repo) {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/contributors`);
    return response.data;
  },

  // Get languages
  async getLanguages(owner, repo) {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/languages`);
    return response.data;
  },

  // Get branches
  async getBranches(owner, repo) {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/branches`);
    return response.data;
  },

  // Get README
  async getReadme(owner, repo) {
    const response = await api.get(`/api/github/repos/${owner}/${repo}/readme`);
    return response.data;
  },

  // Favorite repository
  async favoriteRepository(owner, repo) {
    const response = await api.post(`/api/github/repos/${owner}/${repo}/favorite`);
    return response.data;
  },

  // Unfavorite repository
  async unfavoriteRepository(owner, repo) {
    const response = await api.delete(`/api/github/repos/${owner}/${repo}/favorite`);
    return response.data;
  },

  // Get favorite repositories
  async getFavorites() {
    const response = await api.get('/api/github/favorites');
    return response.data;
  },
};

export default githubService;
