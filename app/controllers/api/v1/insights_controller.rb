module Api
  module V1
    class InsightsController < ApplicationController
      skip_before_action :verify_authenticity_token
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
        # Cache expensive calculations for 5 minutes
        Rails.cache.fetch('insights_summary', expires_in: 5.minutes) do
          # Use single query with aggregations instead of multiple queries
          stats = Employee.select(
            "COUNT(*) as total_count",
            "COUNT(CASE WHEN active = 1 THEN 1 END) as active_count",
            "AVG(salary) as avg_salary",
            "MIN(salary) as min_salary",
            "MAX(salary) as max_salary"
          ).first

          # Get top paying countries with single query
          top_countries = Employee.group(:country)
                                 .average(:salary)
                                 .sort_by { |_, v| -v }
                                 .first(5)
                                 .to_h
                                 .transform_values { |v| v.to_f.round(2) }

          # Get department breakdown
          dept_breakdown = Employee.group(:department).count

          # Get salary bands with single query
          salary_bands = calculate_salary_bands

          # Get recent hires (90 days)
          recent_hires = Employee.where('hired_on >= ?', 90.days.ago).count

          {
            total_employees:      stats.total_count,
            active_employees:     stats.active_count,
            avg_salary:           stats.avg_salary.to_f.round(2),
            min_salary:           stats.min_salary.to_f,
            max_salary:           stats.max_salary.to_f,
            top_paying_countries: top_countries,
            department_breakdown: dept_breakdown,
            salary_bands:         salary_bands,
            recent_hires:         recent_hires
          }
        end
      end

      private

      def calculate_salary_bands
        # Define salary ranges
        bands = [
          [0, 50000],
          [50000, 100000],
          [100000, 150000],
          [150000, 200000],
          [200000, 300000],
          [300000, Float::INFINITY]
        ]

        result = {}
        bands.each do |min, max|
          if max == Float::INFINITY
            count = Employee.where('salary >= ?', min).count
            label = "₹#{min.to_i/1000}k+"
          else
            count = Employee.where('salary >= ? AND salary < ?', min, max).count
            label = "₹#{min.to_i/1000}k-₹#{max.to_i/1000}k"
          end
          result[label] = count
        end
        result
      end
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