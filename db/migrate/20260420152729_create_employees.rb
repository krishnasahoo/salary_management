class CreateEmployees < ActiveRecord::Migration[7.2]
  def change
    create_table :employees do |t|
      t.string :full_name
      t.string :job_title
      t.string :department
      t.string :country
      t.string :email
      t.decimal :salary
      t.string :employment_type
      t.date :hired_on
      t.boolean :active

      t.timestamps
    end
  end
end
