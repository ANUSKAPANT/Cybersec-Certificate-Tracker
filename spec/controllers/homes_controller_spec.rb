require 'rails_helper'

RSpec.describe HomesController, type: :controller do
  include_context 'login user'

  before (:each) do
    create(:user)
    request.headers.merge!({ "Authorization": "Bearer #{User.first.token}" })
  end

  describe "GET #index" do
    it "redirects to user sign in for non signed in user" do
      get :index
      expect(response).to have_http_status(302) # Expects a HTTP Status code of 302
    end

    it "returns a success response for signed in user" do
      stub_login_user!
      get :index
      expect(response).to be_successful # be_successful expects a HTTP Status code of 200
    end
  end
end