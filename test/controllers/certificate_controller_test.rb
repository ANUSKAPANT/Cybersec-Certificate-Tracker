require 'test_helper'

class CertificateControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get certificates_url
    assert_response :success
  end

end
