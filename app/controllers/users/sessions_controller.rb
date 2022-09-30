# frozen_string_literal: true
class Users::SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token, :only => :create

  def destroy
    Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name)
  end
end
