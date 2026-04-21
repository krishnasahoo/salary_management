import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import EmployeesPage from './pages/EmployeesPage'
import InsightsPage  from './pages/InsightsPage'

const queryClient = new QueryClient()

export default function App() {
  const [page, setPage] = useState('employees')

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh',
        background: '#f8fafc' }}>
        {/* Nav */}
        <nav style={{ background: '#1e293b', padding: '0 32px',
          display: 'flex', alignItems: 'center', height: 56 }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginRight: 40 }}>
            💼 Salary Manager
          </span>
          {[['employees','👥 Employees'], ['insights','📊 Insights']].map(([key, label]) => (
            <button key={key} onClick={() => setPage(key)}
              style={{ background: page === key ? '#3b82f6' : 'transparent',
                color: '#fff', border: 'none', padding: '8px 18px',
                borderRadius: 6, cursor: 'pointer', marginRight: 4,
                fontSize: 14, fontWeight: page === key ? 600 : 400 }}>
              {label}
            </button>
          ))}
        </nav>
        {/* Pages */}
        <main style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>
          {page === 'employees' ? <EmployeesPage /> : <InsightsPage />}
        </main>
      </div>
    </QueryClientProvider>
  )
}