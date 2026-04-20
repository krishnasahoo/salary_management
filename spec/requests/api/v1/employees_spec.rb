require 'rails_helper'

RSpec.describe 'Api::V1::Employees', type: :request do
  let!(:employees) { create_list(:employee, 15) }
  let(:employee)   { employees.first }

  describe 'GET /api/v1/employees' do
    it 'returns 200 with paginated data' do
      get '/api/v1/employees'
      json = JSON.parse(response.body)
      expect(response).to have_http_status(200)
      expect(json['data']).to be_an(Array)
      expect(json['meta']).to have_key('total')
    end

    it 'filters by country' do
      get '/api/v1/employees', params: { country: employee.country }
      json = JSON.parse(response.body)
      expect(json['data'].map { |e| e['country'] }.uniq).to eq([employee.country])
    end

    it 'searches by name' do
      get '/api/v1/employees', params: { search: employee.full_name }
      json = JSON.parse(response.body)
      expect(json['data'].first['full_name']).to eq(employee.full_name)
    end
  end

  describe 'GET /api/v1/employees/:id' do
    it 'returns the employee' do
      get "/api/v1/employees/#{employee.id}"
      json = JSON.parse(response.body)
      expect(json['id']).to eq(employee.id)
    end

    it 'returns 404 for unknown id' do
      get '/api/v1/employees/99999'
      expect(response).to have_http_status(404)
    end
  end

  describe 'POST /api/v1/employees' do
    it 'creates an employee with valid params' do
      expect {
        post '/api/v1/employees', params: { employee: attributes_for(:employee) }
      }.to change(Employee, :count).by(1)
      expect(response).to have_http_status(201)
    end

    it 'returns 422 with invalid params' do
      post '/api/v1/employees', params: { employee: { full_name: '' } }
      expect(response).to have_http_status(422)
    end
  end

  describe 'PUT /api/v1/employees/:id' do
    it 'updates the employee' do
      put "/api/v1/employees/#{employee.id}",
          params: { employee: { full_name: 'Updated Name' } }
      expect(response).to have_http_status(200)
      expect(employee.reload.full_name).to eq('Updated Name')
    end
  end

  describe 'DELETE /api/v1/employees/:id' do
    it 'deletes the employee' do
      expect {
        delete "/api/v1/employees/#{employee.id}"
      }.to change(Employee, :count).by(-1)
      expect(response).to have_http_status(204)
    end
  end
end