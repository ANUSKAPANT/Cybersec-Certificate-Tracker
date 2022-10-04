class Api::BaseController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods
  include ActionView::Helpers::SanitizeHelper

  before_action :authenticate
  helper_method :current_user
  serialization_scope :current_user

  def current_user
    @current_user
  end

  protected

  def authenticate
    set_current_user || render_unauthorized
  end

  def set_current_user
    authenticate_with_http_token do |token, _options|
      @current_user = User.find_by(token: token)
    end
  end

  def render_unauthorized
    render json: { message: "Invalid credentials." }, status: :unauthorized unless @current_user
  end

  attr_reader :current_user
end
