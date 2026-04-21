import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, Tooltip,
         PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { getSummary, getInsightsByCountry,
         getFilters, getInsightsByJobTitle } from '../api/employeesApi'

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444',
                '#8b5cf6','#06b6d4','#84cc16','#f97316']

export default function InsightsPage() {
  const [country,  setCountry]  = useState('')
  const [jobTitle, setJobTitle] = useState('')

  const { data: summary }  = useQuery({ queryKey: ['summary'],
    queryFn: () => getSummary().then(r => r.data) })
  const { data: filters }  = useQuery({ queryKey: ['filters'],
    queryFn: () => getFilters().then(r => r.data) })
  const { data: countryInsight } = useQuery({
    queryKey: ['country-insight', country],
    queryFn:  () => getInsightsByCountry(country).then(r => r.data),
    enabled: !!country
  })
  const { data: jobInsight } = useQuery({
    queryKey: ['job-insight', country, jobTitle],
    queryFn:  () => getInsightsByJobTitle(country, jobTitle).then(r => r.data),
    enabled: !!country && !!jobTitle
  })

  const deptData = summary?.department_breakdown
    ? Object.entries(summary.department_breakdown)
        .map(([name, value]) => ({ name, value }))
    : []

  const salaryBands = summary?.salary_bands
    ? Object.entries(summary.salary_bands)
        .map(([name, value]) => ({ name, value }))
    : []

  const topCountries = summary?.top_paying_countries
    ? Object.entries(summary.top_paying_countries)
        .map(([name, value]) => ({ name, value }))
    : []

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', marginBottom: 24 }}>
        Salary Insights
      </h1>

      {/* Summary KPI Cards */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Employees',  value: summary.total_employees?.toLocaleString(), color: '#3b82f6' },
            { label: 'Active Employees', value: summary.active_employees?.toLocaleString(), color: '#10b981' },
            { label: 'Avg Salary',       value: `₹${summary.avg_salary?.toLocaleString()}`, color: '#f59e0b' },
            { label: 'Recent Hires (90d)', value: summary.recent_hires?.toLocaleString(), color: '#8b5cf6' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 12, padding: 20, borderTop: `4px solid ${color}` }}>
              <div style={{ color: '#64748b', fontSize: 13 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#1e293b',
                marginTop: 4 }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 20, marginBottom: 32 }}>
        {/* Department Breakdown */}
        <div style={card}>
          <h3 style={cardTitle}>Employees by Department</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={deptData} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={80}>
                {deptData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Salary Bands */}
        <div style={card}>
          <h3 style={cardTitle}>Salary Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salaryBands} margin={{ left: 0, right: 10 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Paying Countries */}
        <div style={card}>
          <h3 style={cardTitle}>Top Paying Countries (Avg ₹)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topCountries} layout="vertical"
              margin={{ left: 20, right: 20 }}>
              <XAxis type="number" tick={{ fontSize: 11 }}
                tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
              <Bar dataKey="value" radius={[0,4,4,0]}>
                {topCountries.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Country + Job Title Drill Down */}
      <div style={card}>
        <h3 style={cardTitle}>Drill-Down Analysis</h3>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <select value={country} onChange={e => setCountry(e.target.value)}
            style={sel}>
            <option value=''>Select Country...</option>
            {filters?.countries?.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={jobTitle} onChange={e => setJobTitle(e.target.value)}
            style={sel} disabled={!country}>
            <option value=''>Select Job Title...</option>
            {filters?.job_titles?.map(j => <option key={j}>{j}</option>)}
          </select>
        </div>

        {countryInsight && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Headcount',   value: countryInsight.headcount },
              { label: 'Min Salary',  value: `₹${countryInsight.min_salary?.toLocaleString()}` },
              { label: 'Avg Salary',  value: `₹${countryInsight.avg_salary?.toLocaleString()}` },
              { label: 'Max Salary',  value: `₹${countryInsight.max_salary?.toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#f8fafc', borderRadius: 8,
                padding: 14, textAlign: 'center' }}>
                <div style={{ color: '#64748b', fontSize: 12 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>{value}</div>
              </div>
            ))}
          </div>
        )}

        {jobInsight && (
          <div style={{ background: '#eff6ff', borderRadius: 8, padding: 16 }}>
            <strong style={{ color: '#1d4ed8' }}>{jobInsight.job_title}</strong>
            {' '}in{' '}
            <strong style={{ color: '#1d4ed8' }}>{jobInsight.country}</strong>
            <span style={{ margin: '0 8px', color: '#64748b' }}>·</span>
            {jobInsight.headcount} employees
            <span style={{ margin: '0 8px', color: '#64748b' }}>·</span>
            Avg: <strong>₹{jobInsight.avg_salary?.toLocaleString()}</strong>
            <span style={{ margin: '0 8px', color: '#64748b' }}>·</span>
            Range: ₹{jobInsight.min_salary?.toLocaleString()} – ₹{jobInsight.max_salary?.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  )
}

const card     = { background: '#fff', border: '1px solid #e2e8f0',
  borderRadius: 12, padding: 20 }
const cardTitle = { margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: '#374151' }
const sel      = { padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 8,
  fontSize: 14, flex: 1, outline: 'none', background: '#fff' }