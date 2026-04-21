import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import EmployeeForm from '../components/EmployeeForm'

describe('EmployeeForm', () => {
  it('renders all required fields', () => {
    render(<EmployeeForm onSubmit={() => {}} onCancel={() => {}} />)
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/salary/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument()
  })

  it('pre-fills values when editing', () => {
    const emp = { full_name: 'Anita', job_title: 'Engineer',
                  department: 'Engineering', country: 'India',
                  email: 'a@b.com', salary: 80000,
                  employment_type: 'full_time', active: true }
    render(<EmployeeForm employee={emp} onSubmit={() => {}} onCancel={() => {}} />)
    expect(screen.getByLabelText(/full name/i).value).toBe('Anita')
    expect(screen.getByLabelText(/salary/i).value).toBe('80000')
  })

  it('calls onSubmit with form data', () => {
    const onSubmit = vi.fn()
    render(<EmployeeForm onSubmit={onSubmit} onCancel={() => {}} />)
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } })
    fireEvent.submit(screen.getByRole('form'))
    expect(onSubmit).toHaveBeenCalled()
  })
})