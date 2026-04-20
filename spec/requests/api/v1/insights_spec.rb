require 'rails_helper'

RSpec.describe 'Api::V1::Insights', type: :request do
  before do
    create(:employee, country: 'India', job_title: 'Engineer',
           department: 'Engineering', salary: 50_000, employment_type: 'full_time')
    create(:employee, country: 'India', job_title: 'Engineer',
           department: 'Engineering', salary: 70_000, employment_type: 'part_time')
    create(:employee, country: 'India', job_title: 'Manager',
           department: 'HR',          salary: 90_000, employment_type: 'full_time')
    create(:employee, country: 'USA',  job_title: 'Engineer',
           department: 'Engineering', salary: 120_000, employment_type: 'contract')
  end

  describe 'GET /api/v1/insights/by_country' do
    it 'returns salary stats for a country' do
      get '/api/v1/insights/by_country', params: { country: 'India' }
      json = JSON.parse(response.body)
      expect(json['min_salary']).to eq(50_000.0)
      expect(json['max_salary']).to eq(90_000.0)
      expect(json['avg_salary']).to be_within(0.01).of(70_000.0)
      expect(json['headcount']).to  eq(3)
      expect(json['department_breakdown']).to be_a(Hash)
    end
  end

  describe 'GET /api/v1/insights/by_job_title' do
    it 'returns salary stats for job title in a country' do
      get '/api/v1/insights/by_job_title',
          params: { country: 'India', job_title: 'Engineer' }
      json = JSON.parse(response.body)
      expect(json['avg_salary']).to be_within(0.01).of(60_000.0)
      expect(json['headcount']).to eq(2)
    end
  end

  describe 'GET /api/v1/insights/summary' do
    it 'returns global metrics' do
      get '/api/v1/insights/summary'
      json = JSON.parse(response.body)
      expect(json['total_employees']).to   eq(4)
      expect(json['avg_salary']).to        be_a(Float)
      expect(json['top_paying_countries']).to be_a(Hash)
      expect(json['department_breakdown']).to be_a(Hash)
      expect(json['employment_type_breakdown']).to be_a(Hash)
    end
  end

  describe 'GET /api/v1/insights/filters' do
    it 'returns unique filter options' do
      get '/api/v1/insights/filters'
      json = JSON.parse(response.body)
      expect(json['countries']).to  include('India', 'USA')
      expect(json['job_titles']).to include('Engineer')
      expect(json['departments']).to be_an(Array)
    end
  end
end