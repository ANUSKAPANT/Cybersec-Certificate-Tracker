class ApplicationController < ActionController::Base
  respond_to :json, :html
  def after_sign_in_path_for(resource)
    certificates_path
  end
end
