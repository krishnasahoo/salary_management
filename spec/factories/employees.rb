FactoryBot.define do
  factory :employee do
    full_name { "MyString" }
    job_title { "MyString" }
    department { "MyString" }
    country { "MyString" }
    email { "MyString" }
    salary { "9.99" }
    employment_type { "MyString" }
    hired_on { "2026-04-20" }
    active { false }
  end
end
