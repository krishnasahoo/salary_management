module Api
  module V1
    class EmployeesController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_employee, only: [:show, :update, :destroy]

      def index
        scope = Employee.all
        scope = scope.where('LOWER(full_name) LIKE ?',
                            "%#{params[:search].downcase}%") if params[:search].present?
        scope = scope.by_country(params[:country])        if params[:country].present?
        scope = scope.by_job_title(params[:job_title])    if params[:job_title].present?
        scope = scope.where(active: params[:active])      if params[:active].present?
        scope = scope.order(params[:sort_by] || 'full_name')
        scope = scope.page(params[:page]).per(params[:per_page] || 25)

        render json: {
          data: scope.map { |e| serialize(e) },
          meta: {
            total:       scope.total_count,
            page:        scope.current_page,
            total_pages: scope.total_pages,
            per_page:    scope.limit_value
          }
        }
      end

      def show
        render json: serialize(@employee)
      end

      def create
        employee = Employee.new(employee_params)
        if employee.save
          render json: serialize(employee), status: :created
        else
          render json: { errors: employee.errors.full_messages },
                 status: :unprocessable_entity
        end
      end

      def update
        if @employee.update(employee_params)
          render json: serialize(@employee)
        else
          render json: { errors: @employee.errors.full_messages },
                 status: :unprocessable_entity
        end
      end

      def destroy
        @employee.destroy
        head :no_content
      end

      private

      def set_employee
        @employee = Employee.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Employee not found' }, status: :not_found
      end

      def employee_params
        params.require(:employee).permit(
          :full_name, :job_title, :department, :country,
          :email, :salary, :employment_type, :hired_on, :active
        )
      end

      def serialize(e)
        e.as_json(only: %i[id full_name job_title department country
                           email salary employment_type hired_on active])
      end
    end
  end
end