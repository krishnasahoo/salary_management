module Api
  module V1
    class InsightsController < ApplicationController
      def by_country
        country = params[:country]
        scope   = Employee.by_country(country)

        render json: {
          country:                   country,
          min_salary:                scope.minimum(:salary).to_f,
          max_salary:                scope.maximum(:salary).to_f,
          avg_salary:                scope.average(:salary).to_f.round(2),
          headcount:                 scope.count,
          active_count:              scope.active.count,
          department_breakdown:      scope.group(:department).count,
          job_title_breakdown:       scope.group(:job_title).average(:salary)
                                         .transform_values { |v| v.to_f.round(2) },
          employment_type_breakdown: scope.group(:employment_type).count
        }
      end

      def by_job_title
        country   = params[:country]
        job_title = params[:job_title]
        scope     = Employee.by_country(country).by_job_title(job_title)

        render json: {
          country:    country,
          job_title:  job_title,
          avg_salary: scope.average(:salary).to_f.round(2),
          min_salary: scope.minimum(:salary).to_f,
          max_salary: scope.maximum(:salary).to_f,
          headcount:  scope.count
        }
      end

      def summary
        render json: {
          total_employees:          Employee.count,
          active_employees:         Employee.active.count,
          avg_salary:               Employee.average(:salary).to_f.round(2),
          min_salary:               Employee.minimum(:salary).to_f,
          max_salary:               Employee.maximum(:salary).to_f,
          top_paying_countries:     Employee.group(:country)
                                            .average(:salary)
                                            .sort_by { |_, v| -v }
                                            .first(5).to_h
                                            .transform_values { |v| v.to_f.round(2) },
          department_breakdown:     Employee.group(:department).count,
          employment_type_breakdown: Employee.group(:employment_type).count,
          recent_hires:             Employee.where(hired_on: 90.days.ago..).count,
          salary_bands:             salary_band_summary
        }
      end

      def filters
        render json: {
          countries:   Employee.distinct.order(:country).pluck(:country).compact,
          job_titles:  Employee.distinct.order(:job_title).pluck(:job_title).compact,
          departments: Employee.distinct.order(:department).pluck(:department).compact
        }
      end

      private

      def salary_band_summary
        {
          'Under 50k':    Employee.where(salary: ..50_000).count,
          '50k-100k':     Employee.where(salary: 50_001..100_000).count,
          '100k-150k':    Employee.where(salary: 100_001..150_000).count,
          'Above 150k':   Employee.where(salary: 150_001..).count
        }
      end
    end
  end
end