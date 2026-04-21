# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2026_04_21_142029) do
  create_table "employees", force: :cascade do |t|
    t.string "full_name"
    t.string "job_title"
    t.string "department"
    t.string "country"
    t.string "email"
    t.decimal "salary"
    t.string "employment_type"
    t.date "hired_on"
    t.boolean "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["active"], name: "index_employees_on_active"
    t.index ["country", "active"], name: "index_employees_on_country_and_active"
    t.index ["country", "job_title"], name: "index_employees_on_country_and_job_title"
    t.index ["country"], name: "index_employees_on_country"
    t.index ["department", "active"], name: "index_employees_on_department_and_active"
    t.index ["department"], name: "index_employees_on_department"
    t.index ["email"], name: "index_employees_on_email", unique: true
    t.index ["employment_type"], name: "index_employees_on_employment_type"
    t.index ["hired_on"], name: "index_employees_on_hired_on"
    t.index ["job_title", "active"], name: "index_employees_on_job_title_and_active"
    t.index ["job_title"], name: "index_employees_on_job_title"
    t.index ["salary"], name: "index_employees_on_salary"
  end
end
