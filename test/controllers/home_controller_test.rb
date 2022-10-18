require 'test_helper'

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "should get add_form" do
    get home_add_form_url
    assert_response :success
  end

end
