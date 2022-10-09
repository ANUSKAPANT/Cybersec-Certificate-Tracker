class Api::V1::DashboardController < ApplicationController
  before_action :authenticate_user!
  def upload_file
    puts "HI"
    file = params[:file]
    puts file
  end
end

