// Frontend API client for calling the backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = null
  }

  setToken(token) {
    this.token = token
  }

  getToken() {
    return this.token || localStorage.getItem('authToken')
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getToken()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication endpoints
  async login(email, password, role) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password, role }
    })
  }

  async register(email, password, role, profile) {
    return this.request('/auth/register', {
      method: 'POST',
      body: { email, password, role, profile }
    })
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    })
  }

  async refreshToken(refreshToken) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: { refresh_token: refreshToken }
    })
  }

  // User endpoints
  async getCurrentUser() {
    return this.request('/users/me')
  }

  async getUserProfile() {
    return this.request('/users/profile')
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: profileData
    })
  }

  async deleteAccount() {
    return this.request('/users/account', {
      method: 'DELETE'
    })
  }

  // Profile endpoints
  async getProfile(id) {
    return this.request(`/profiles/${id}`)
  }

  async getCandidateProfile(id) {
    return this.request(`/profiles/candidate/${id}/detailed`)
  }

  async getRecruiterProfile(id) {
    return this.request(`/profiles/recruiter/${id}/detailed`)
  }

  async searchCandidates(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/profiles/candidates?${queryString}`)
  }

  // Job endpoints
  async getJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/jobs?${queryString}`)
  }

  async getJob(id) {
    return this.request(`/jobs/${id}`)
  }

  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: jobData
    })
  }

  async updateJob(id, jobData) {
    return this.request(`/jobs/${id}`, {
      method: 'PUT',
      body: jobData
    })
  }

  async deleteJob(id) {
    return this.request(`/jobs/${id}`, {
      method: 'DELETE'
    })
  }

  async getMyJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/jobs/my/jobs?${queryString}`)
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/dashboard/stats')
  }

  async getAdminUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/admin/users?${queryString}`)
  }

  async getAdminUser(id) {
    return this.request(`/admin/users/${id}`)
  }

  async updateUserRole(id, role) {
    return this.request(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: { role }
    })
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE'
    })
  }

  async getAdminJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/admin/jobs?${queryString}`)
  }

  async updateJobStatus(id, status) {
    return this.request(`/admin/jobs/${id}/status`, {
      method: 'PUT',
      body: { status }
    })
  }

  async getSystemHealth() {
    return this.request('/admin/system/health')
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient()

// Export the class for creating new instances if needed
export default ApiClient
