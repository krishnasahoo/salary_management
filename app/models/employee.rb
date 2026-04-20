class Employee < ApplicationRecord
  EMPLOYMENT_TYPES = %w[full_time part_time contract].freeze

  validates :full_name,       presence: true
  validates :job_title,       presence: true
  validates :department,      presence: true
  validates :country,         presence: true
  validates :email,           presence: true,
                              uniqueness: { case_sensitive: false }
  validates :salary,          presence: true,
                              numericality: { greater_than: 0 }
  validates :employment_type, presence: true,
                              inclusion: { in: EMPLOYMENT_TYPES }

  before_save :normalize_email

  scope :by_country,   ->(c) { where(country: c) }
  scope :by_job_title, ->(j) { where(job_title: j) }
  scope :active,       ->    { where(active: true) }

  private

  def normalize_email
    self.email = email.downcase.strip if email.present?
  end
end