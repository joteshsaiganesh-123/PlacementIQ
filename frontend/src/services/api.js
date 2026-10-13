const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  let user = null;
  try {
    const saved = localStorage.getItem('placement_user');
    if (saved) user = JSON.parse(saved);
  } catch (e) {
    // ignore parse error
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(user?.role ? { 'X-User-Role': user.role } : {}),
    ...(user?.id ? { 'X-User-Id': String(user.id) } : {}),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errorMsg = `Error ${res.status}: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData.error) errorMsg = errorData.error;
      } catch (e) {
        // ignore json parse error
      }
      throw new Error(errorMsg);
    }
    if (res.status === 204) return null;
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  googleLogin: (googleData) => request('/auth/google', {
    method: 'POST',
    body: JSON.stringify(googleData)
  }),

  // Drives
  getAllDrives: () => request('/drives'),
  getDriveById: (id) => request(`/drives/${id}`),
  createDrive: (drive) => request('/drives', {
    method: 'POST',
    body: JSON.stringify(drive)
  }),
  updateDrive: (id, drive) => request(`/drives/${id}`, {
    method: 'PUT',
    body: JSON.stringify(drive)
  }),
  deleteDrive: (id) => request(`/drives/${id}`, {
    method: 'DELETE'
  }),

  // Students
  getAllStudents: () => request('/students'),
  getStudentById: (id) => request(`/students/${id}`),
  getStudentByUserId: (userId) => request(`/students/user/${userId}`),
  updateStudentProfile: (id, profile) => request(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(profile)
  }),
  checkEligibility: (studentId, driveId) => request(`/students/${studentId}/eligibility/${driveId}`),
  getAtsScore: (studentId, driveId) => request(`/students/${studentId}/ats-score/${driveId}`),

  // Companies
  getAllCompanies: () => request('/companies'),
  getCompanyById: (id) => request(`/companies/${id}`),
  createCompany: (company) => request('/companies', {
    method: 'POST',
    body: JSON.stringify(company)
  }),
  updateCompany: (id, company) => request(`/companies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(company)
  }),

  // Applications
  applyToDrive: (studentId, driveId) => request('/applications/apply', {
    method: 'POST',
    body: JSON.stringify({ studentId, driveId })
  }),
  getAllApplications: () => request('/applications'),
  getApplicationById: (id) => request(`/applications/${id}`),
  getApplicationsByStudent: (studentId) => request(`/applications/student/${studentId}`),
  getApplicationsByDrive: (driveId) => request(`/applications/drive/${driveId}`),
  updateApplicationStatus: (id, statusData) => request(`/applications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData)
  }),

  // Analytics
  getAnalyticsSummary: () => request('/analytics/summary')
};
