export default function EmployeeTable({ employees, onEdit, onDelete }) {
  if (!employees.length)
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
        No employees found.
      </div>
    )

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            {['Full Name','Job Title','Department','Country',
              'Salary','Type','Status','Actions'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left',
                fontWeight: 600, color: '#475569', whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, i) => (
            <tr key={emp.id}
              style={{ borderBottom: '1px solid #f1f5f9',
                background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
              <td style={td}><strong>{emp.full_name}</strong></td>
              <td style={td}>{emp.job_title}</td>
              <td style={td}>{emp.department}</td>
              <td style={td}>{emp.country}</td>
              <td style={td}>₹{Number(emp.salary).toLocaleString()}</td>
              <td style={td}>
                <span style={badge('#eff6ff','#3b82f6')}>
                  {emp.employment_type?.replace('_',' ')}
                </span>
              </td>
              <td style={td}>
                <span style={badge(emp.active ? '#f0fdf4':'#fef2f2',
                                   emp.active ? '#16a34a':'#dc2626')}>
                  {emp.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td style={td}>
                <button onClick={() => onEdit(emp)} style={btnPrimary}>Edit</button>
                <button onClick={() => onDelete(emp.id)} style={btnDanger}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const td = { padding: '12px 16px', verticalAlign: 'middle' }
const badge = (bg, color) => ({
  display: 'inline-block', padding: '2px 10px', borderRadius: 12,
  fontSize: 12, fontWeight: 500, background: bg, color
})
const btnPrimary = {
  marginRight: 6, padding: '5px 14px', borderRadius: 6, border: '1px solid #3b82f6',
  background: '#eff6ff', color: '#2563eb', cursor: 'pointer', fontSize: 13
}
const btnDanger = {
  padding: '5px 14px', borderRadius: 6, border: '1px solid #fca5a5',
  background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: 13
}