import axios from 'axios'

const api = axios.create({ baseURL: '/api/v1' })

export const getEmployees   = (params) => api.get('/employees', { params })
export const createEmployee = (data)   => api.post('/employees', { employee: data })
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, { employee: data })
export const deleteEmployee = (id)     => api.delete(`/employees/${id}`)

export const getInsightsByCountry  = (country)            =>
  api.get('/insights/by_country', { params: { country } })
export const getInsightsByJobTitle = (country, job_title) =>
  api.get('/insights/by_job_title', { params: { country, job_title } })
export const getSummary   = ()     => api.get('/insights/summary')
export const getFilters   = ()     => api.get('/insights/filters')