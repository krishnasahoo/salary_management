FactoryBot.define do
  factory :employee do
    full_name       { Faker::Name.name }
    job_title       { Faker::Job.title }
    department      { Faker::Commerce.department(max: 1) }
    country         { Faker::Address.country }
    email           { Faker::Internet.unique.email }
    salary          { rand(30_000.0..200_000.0).round(2) }
    employment_type { %w[full_time part_time contract].sample }
    hired_on        { Faker::Date.between(from: 5.years.ago, to: Date.today) }
    active          { true }
  end
end