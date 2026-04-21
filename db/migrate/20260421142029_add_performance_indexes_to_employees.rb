class AddPerformanceIndexesToEmployees < ActiveRecord::Migration[7.2]
  def change
    # Add indexes for frequently queried fields
    add_index :employees, :country
    add_index :employees, :department
    add_index :employees, :job_title
    add_index :employees, :active
    add_index :employees, :email, unique: true
    add_index :employees, :employment_type
    add_index :employees, :hired_on

    # Composite indexes for common query patterns
    add_index :employees, [:country, :active]
    add_index :employees, [:country, :job_title]
    add_index :employees, [:department, :active]
    add_index :employees, [:job_title, :active]

    # Index for salary aggregations (helps with ORDER BY and GROUP BY)
    add_index :employees, :salary
  end
end
