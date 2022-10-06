require 'rails_helper'

RSpec.describe Devise::SessionsController, type: :controller do
  describe "Destroy user session" do
    it "logs user out" do
      @controller = HomesController.new
      @request.env["devise.mapping"] = Devise.mappings[:user]
      user = FactoryBot.create(:user)
      sign_in user
      get :index
      expect(response).to be_successful # be_successful expects a HTTP Status code of 200
      sign_out user
      get :index
      expect(response).to have_http_status(302) # Expects a HTTP Status code of 302
    end
  end
end