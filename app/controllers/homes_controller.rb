class HomesController < ApplicationController
  respond_to :json, :html
  before_action :authenticate_user!
  def index
  end
end