class BaseController < ActionController::Base
  include ActionController::HttpAuthentication::Token::ControllerMethods
  include ActionView::Helpers::SanitizeHelper

  before_action :authenticate, :authorize_admin
  helper_method :current_user
  serialization_scope :current_user

  def authorize_admin
    return render json: { message: 'only accessible to admin' }, status: :unprocessable_entity unless @current_user.admin?
  end

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
