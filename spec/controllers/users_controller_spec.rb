require 'rails_helper'

RSpec.describe UsersController, type: :controller do

  before (:each) do
    create(:user)
    request.headers.merge!({ "Authorization": "Bearer #{User.first.token}" })
  end

  describe "GET index" do
    it "returns a successful response" do
      get :index
      expect(response).to be_successful
    end
  end

  describe 'PATCH update' do
    it 'updates the user' do
      user = User.new(email: "demo@example.com", password: "demo123")
      user.save
      patch :update, params: { id: user.id, password: "demo1234"}
      expect(response).to have_http_status(201)
    end

    it 'does not update the user' do
      user = User.new(email: "demo@example.com", password: "demo123")
      user.save
      patch :update, params: {id: user.id, email: nil }
      expect(response).to have_http_status(422)
    end
  end

  describe 'GET show' do
    it 'shows the user' do
      user = User.new(email: "demo@example.com", password: "demo123")
      user.save
      get :show, params: { id: user.id }
      expect(response).to have_http_status(200)
    end
  end

  describe 'POST create' do
    it 'creates a user and renders a successful response' do
      post :create, params: { email: "demo12@example.com", password: "demo12345" }
      expect(response).to have_http_status(201)
    end

    it 'does not create a user' do
      post :create, params: { id: nil }
      expect(response).to have_http_status(422)
    end
  end

  describe 'DESTROY delete' do
    it 'deletes a user and renders a successful response' do
      user = User.new(email: "demo@example.com", password: "demo123")
      user.save
      delete :destroy, params: { id: user.id }
      expect(response).to have_http_status(204)
    end
  end
end