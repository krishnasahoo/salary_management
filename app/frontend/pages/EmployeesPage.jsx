import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEmployees, createEmployee, updateEmployee,
         deleteEmployee } from '../api/employeesApi'
import EmployeeTable from '../components/EmployeeTable'
import EmployeeForm  from '../components/EmployeeForm'

export default function EmployeesPage() {
  const qc         = useQueryClient()
  const [page, setPage]       = useState(1)
  const [search, setSearch]   = useState('')
  const [country, setCountry] = useState('')
  const [modal, setModal]     = useState(null)   // null | 'add' | employee obj

  const { data, isLoading } = useQuery({
    queryKey: ['employees', page, search, country],
    queryFn:  () => getEmployees({ page, search, country, per_page: 25 })
                    .then(r => r.data),
    keepPreviousData: true
  })

  const createMut = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => { qc.invalidateQueries(['employees']); setModal(null) }
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateEmployee(id, data),
    onSuccess: () => { qc.invalidateQueries(['employees']); setModal(null) }
  })
  const deleteMut = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => qc.invalidateQueries(['employees'])
  })

  const handleSubmit = (formData) => {
    if (modal?.id) updateMut.mutate({ id: modal.id, data: formData })
    else           createMut.mutate(formData)
  }

  const employees = data?.data    || []
  const meta      = data?.meta    || {}

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#1e293b' }}>
          Employees
          <span style={{ marginLeft: 10, fontSize: 14, color: '#64748b',
            fontWeight: 400 }}>
            {meta.total ? `(${meta.total.toLocaleString()} total)` : ''}
          </span>
        </h1>
        <button onClick={() => setModal('add')} style={btnAdd}>+ Add Employee</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input placeholder="🔍 Search by name..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          style={filterInput} />
        <input placeholder="Filter by country..."
          value={country} onChange={e => { setCountry(e.target.value); setPage(1) }}
          style={{ ...filterInput, maxWidth: 220 }} />
        {(search || country) && (
          <button onClick={() => { setSearch(''); setCountry(''); setPage(1) }}
            style={clearBtn}>✕ Clear</button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12,
        border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {isLoading
          ? <div style={{ padding: 48, textAlign: 'center', color: '#64748b' }}>
              Loading employees...
            </div>
          : <EmployeeTable employees={employees}
              onEdit={(emp) => setModal(emp)}
              onDelete={(id) => {
                if (window.confirm('Delete this employee?')) deleteMut.mutate(id)
              }} />
        }
      </div>

      {/* Pagination */}
      {meta.total_pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center',
          gap: 8, marginTop: 20, alignItems: 'center' }}>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            style={pgBtn(page === 1)}>← Prev</button>
          <span style={{ color: '#64748b', fontSize: 14 }}>
            Page {page} of {meta.total_pages}
          </span>
          <button disabled={page === meta.total_pages}
            onClick={() => setPage(p => p + 1)}
            style={pgBtn(page === meta.total_pages)}>Next →</button>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={overlay}>
          <div style={modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, color: '#1e293b' }}>
                {modal === 'add' ? 'Add New Employee' : 'Edit Employee'}
              </h2>
              <button onClick={() => setModal(null)}
                style={{ background: 'none', border: 'none',
                  fontSize: 20, cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            <EmployeeForm
              employee={modal === 'add' ? {} : modal}
              onSubmit={handleSubmit}
              onCancel={() => setModal(null)} />
          </div>
        </div>
      )}
    </div>
  )
}

const btnAdd    = { padding: '9px 20px', background: '#3b82f6', color: '#fff',
  border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }
const filterInput = { padding: '8px 14px', border: '1px solid #e2e8f0',
  borderRadius: 8, fontSize: 14, flex: 1, outline: 'none' }
const clearBtn  = { padding: '8px 14px', background: '#fef2f2', border: '1px solid #fca5a5',
  borderRadius: 8, color: '#dc2626', cursor: 'pointer', fontSize: 13 }
const pgBtn     = (disabled) => ({
  padding: '7px 16px', border: '1px solid #e2e8f0', borderRadius: 6,
  background: disabled ? '#f8fafc' : '#fff', color: disabled ? '#94a3b8' : '#374151',
  cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 14
})
const overlay   = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }
const modalBox  = { background: '#fff', borderRadius: 12, padding: 28,
  width: '90%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto',
  boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }