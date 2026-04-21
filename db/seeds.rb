# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts "🌱 Seeding 10,000 employees..."
start = Time.now

first_names = File.readlines(
  Rails.root.join('lib/seeds/first_names.txt')
).flat_map { |l| l.split(',') }.map(&:strip).reject(&:empty?)

last_names = File.readlines(
  Rails.root.join('lib/seeds/last_names.txt')
).flat_map { |l| l.split(',') }.map(&:strip).reject(&:empty?)

COUNTRIES   = %w[India USA UK Germany Canada Australia France Japan Brazil Singapore
                 Netherlands Sweden Norway Denmark Spain Italy Mexico Argentina].freeze
JOB_TITLES  = ['Software Engineer', 'Senior Software Engineer', 'Staff Engineer',
                'Engineering Manager', 'Product Manager', 'Data Analyst',
                'Data Scientist', 'HR Specialist', 'Finance Analyst',
                'Marketing Manager', 'DevOps Engineer', 'QA Engineer',
                'UX Designer', 'Business Analyst', 'Scrum Master'].freeze
DEPARTMENTS = %w[Engineering Product HR Finance Marketing Operations Design Data Legal].freeze
EMP_TYPES   = %w[full_time part_time contract].freeze

Employee.delete_all

batch_size = 500
batch      = []

10_000.times do |i|
  first = first_names.sample
  last  = last_names.sample

  batch << {
    full_name:       "#{first} #{last}",
    job_title:       JOB_TITLES.sample,
    department:      DEPARTMENTS.sample,
    country:         COUNTRIES.sample,
    email:           "#{first.downcase}.#{last.downcase}.#{i}@company.com",
    salary:          rand(30_000..250_000).to_f,
    employment_type: EMP_TYPES.sample,
    hired_on:        Date.today - rand(0..1825),
    active:          [true, true, true, false].sample,
    created_at:      Time.now,
    updated_at:      Time.now
  }

  if batch.size >= batch_size
    Employee.insert_all(batch)
    batch = []
    print "."
  end
end

Employee.insert_all(batch) if batch.any?

elapsed = (Time.now - start).round(2)
puts "\n✅ Done! #{Employee.count} employees seeded in #{elapsed}s"