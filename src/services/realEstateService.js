import api from './api';

const realEstateService = {
  // ========== PROPERTIES ==========

  // Get all properties
  async getProperties(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/properties?${params}`);
    return response.data;
  },

  // Get single property
  async getProperty(id) {
    const response = await api.get(`/api/properties/${id}`);
    return response.data;
  },

  // Create property
  async createProperty(data) {
    const response = await api.post('/api/properties', data);
    return response.data;
  },

  // Update property
  async updateProperty(id, data) {
    const response = await api.put(`/api/properties/${id}`, data);
    return response.data;
  },

  // Delete property
  async deleteProperty(id) {
    const response = await api.delete(`/api/properties/${id}`);
    return response.data;
  },

  // Get property statistics
  async getPropertyStats() {
    const response = await api.get('/api/properties/stats/overview');
    return response.data;
  },

  // ========== DEALS ==========

  // Get all deals
  async getDeals(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/deals?${params}`);
    return response.data;
  },

  // Get deals by stage (for kanban)
  async getDealsByStage() {
    const response = await api.get('/api/deals/by-stage');
    return response.data;
  },

  // Get single deal
  async getDeal(id) {
    const response = await api.get(`/api/deals/${id}`);
    return response.data;
  },

  // Create deal
  async createDeal(data) {
    const response = await api.post('/api/deals', data);
    return response.data;
  },

  // Update deal
  async updateDeal(id, data) {
    const response = await api.put(`/api/deals/${id}`, data);
    return response.data;
  },

  // Update deal stage (for drag-and-drop)
  async updateDealStage(id, stage) {
    const response = await api.patch(`/api/deals/${id}/stage`, { stage });
    return response.data;
  },

  // Delete deal
  async deleteDeal(id) {
    const response = await api.delete(`/api/deals/${id}`);
    return response.data;
  },

  // Get deal statistics
  async getDealStats() {
    const response = await api.get('/api/deals/stats/overview');
    return response.data;
  },

  // Get deals closing soon
  async getDealsClosingSoon() {
    const response = await api.get('/api/deals/stats/closing-soon');
    return response.data;
  },

  // ========== CONTACTS ==========

  // Get all contacts
  async getContacts(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/contacts?${params}`);
    return response.data;
  },

  // Get single contact
  async getContact(id) {
    const response = await api.get(`/api/contacts/${id}`);
    return response.data;
  },

  // Create contact
  async createContact(data) {
    const response = await api.post('/api/contacts', data);
    return response.data;
  },

  // Update contact
  async updateContact(id, data) {
    const response = await api.put(`/api/contacts/${id}`, data);
    return response.data;
  },

  // Delete contact
  async deleteContact(id) {
    const response = await api.delete(`/api/contacts/${id}`);
    return response.data;
  },

  // ========== TASKS ==========

  // Get all tasks
  async getTasks(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/tasks?${params}`);
    return response.data;
  },

  // Get single task
  async getTask(id) {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },

  // Create task
  async createTask(data) {
    const response = await api.post('/api/tasks', data);
    return response.data;
  },

  // Update task
  async updateTask(id, data) {
    const response = await api.put(`/api/tasks/${id}`, data);
    return response.data;
  },

  // Delete task
  async deleteTask(id) {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  },

  // ========== FINANCIAL RECORDS ==========

  // Get financial records
  async getFinancialRecords(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/financial-records?${params}`);
    return response.data;
  },

  // Create financial record
  async createFinancialRecord(data) {
    const response = await api.post('/api/financial-records', data);
    return response.data;
  },

  // ========== DOCUMENTS ==========

  // Get documents
  async getDocuments(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/documents?${params}`);
    return response.data;
  },

  // Upload document
  async uploadDocument(data) {
    const response = await api.post('/api/documents', data);
    return response.data;
  },

  // Delete document
  async deleteDocument(id) {
    const response = await api.delete(`/api/documents/${id}`);
    return response.data;
  },

  // ========== NOTES ==========

  // Get notes
  async getNotes(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/api/notes?${params}`);
    return response.data;
  },

  // Create note
  async createNote(data) {
    const response = await api.post('/api/notes', data);
    return response.data;
  },

  // ========== DASHBOARD / ANALYTICS ==========

  // Get dashboard overview
  async getDashboardOverview() {
    const response = await api.get('/api/dashboard/overview');
    return response.data;
  },

  // Get analytics data
  async getAnalytics(timeframe = '30d') {
    const response = await api.get(`/api/analytics?timeframe=${timeframe}`);
    return response.data;
  },
};

export default realEstateService;
