import { useState } from 'react'

const COUNTRIES    = ['India','USA','UK','Germany','Canada','Australia',
                      'France','Japan','Brazil','Singapore','Netherlands',
                      'Sweden','Norway','Spain','Italy','Mexico']
const DEPARTMENTS  = ['Engineering','Product','HR','Finance','Marketing',
                      'Operations','Design','Data','Legal']
const EMP_TYPES    = ['full_time','part_time','contract']

export default function EmployeeForm({ employee = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    full_name:       employee.full_name       || '',
    job_title:       employee.job_title       || '',
    department:      employee.department      || '',
    country:         employee.country         || '',
    email:           employee.email           || '',
    salary:          employee.salary          || '',
    employment_type: employee.employment_type || 'full_time',
    hired_on:        employee.hired_on        || '',
    active:          employee.active ?? true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} role="form"
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {[
        { label: 'Full Name',  name: 'full_name',  type: 'text' },
        { label: 'Job Title',  name: 'job_title',  type: 'text' },
        { label: 'Email',      name: 'email',      type: 'email' },
        { label: 'Salary',     name: 'salary',     type: 'number' },
        { label: 'Hired On',   name: 'hired_on',   type: 'date' },
      ].map(({ label, name, type }) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label htmlFor={name} style={labelStyle}>{label}</label>
          <input id={name} name={name} type={type} value={form[name]}
            onChange={handleChange} required style={inputStyle} />
        </div>
      ))}

      {[
        { label: 'Department', name: 'department', options: DEPARTMENTS },
        { label: 'Country',    name: 'country',    options: COUNTRIES },
        { label: 'Employment Type', name: 'employment_type',
          options: EMP_TYPES, display: (v) => v.replace('_',' ') },
      ].map(({ label, name, options, display }) => (
        <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label htmlFor={name} style={labelStyle}>{label}</label>
          <select id={name} name={name} value={form[name]}
            onChange={handleChange} style={inputStyle}>
            <option value=''>Select...</option>
            {options.map(o => (
              <option key={o} value={o}>{display ? display(o) : o}</option>
            ))}
          </select>
        </div>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 8 }}>
        <input id="active" name="active" type="checkbox"
          checked={form.active} onChange={handleChange} />
        <label htmlFor="active" style={labelStyle}>Active Employee</label>
      </div>

      <div style={{ gridColumn: '1 / -1', display: 'flex',
        justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
        <button type="button" onClick={onCancel} style={btnSecondary}>Cancel</button>
        <button type="submit" style={btnPrimary}>
          {employee.id ? 'Update Employee' : 'Add Employee'}
        </button>
      </div>
    </form>
  )
}

const labelStyle = { fontSize: 13, fontWeight: 500, color: '#374151' }
const inputStyle = {
  padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6,
  fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box'
}
const btnPrimary = {
  padding: '8px 20px', background: '#3b82f6', color: '#fff',
  border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 500
}
const btnSecondary = {
  padding: '8px 20px', background: '#f1f5f9', color: '#374151',
  border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', fontSize: 14
}