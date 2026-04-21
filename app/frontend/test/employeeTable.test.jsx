import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import EmployeeTable from '../components/EmployeeTable'

const mockEmployees = [
  { id: 1, full_name: 'Anita Sharma', job_title: 'Engineer',
    department: 'Engineering', country: 'India',
    salary: 80000, employment_type: 'full_time', active: true },
  { id: 2, full_name: 'John Smith', job_title: 'Manager',
    department: 'HR', country: 'USA',
    salary: 120000, employment_type: 'contract', active: false },
]

describe('EmployeeTable', () => {
  it('renders column headers', () => {
    render(<EmployeeTable employees={mockEmployees} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Full Name')).toBeInTheDocument()
    expect(screen.getByText('Job Title')).toBeInTheDocument()
    expect(screen.getByText('Salary')).toBeInTheDocument()
  })

  it('renders employee rows', () => {
    render(<EmployeeTable employees={mockEmployees} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Anita Sharma')).toBeInTheDocument()
    expect(screen.getByText('John Smith')).toBeInTheDocument()
  })

  it('shows empty state when no employees', () => {
    render(<EmployeeTable employees={[]} onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText(/no employees found/i)).toBeInTheDocument()
  })

  it('calls onEdit when Edit is clicked', () => {
    const onEdit = vi.fn()
    render(<EmployeeTable employees={mockEmployees} onEdit={onEdit} onDelete={() => {}} />)
    fireEvent.click(screen.getAllByText('Edit')[0])
    expect(onEdit).toHaveBeenCalledWith(mockEmployees[0])
  })

  it('calls onDelete when Delete is clicked', () => {
    const onDelete = vi.fn()
    render(<EmployeeTable employees={mockEmployees} onEdit={() => {}} onDelete={onDelete} />)
    fireEvent.click(screen.getAllByText('Delete')[0])
    expect(onDelete).toHaveBeenCalledWith(1)
  })
})