RSpec.shared_context 'login user', shared_context: :metadata do |args|
  def stub_login_user!
    @request.env["devise.mapping"] = Devise.mappings[:user]
    user = FactoryBot.create(:user)
    sign_in user
  end
end