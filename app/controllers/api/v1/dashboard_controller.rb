class Api::V1::DashboardController < ApplicationController
  def upload_file
    file = params[:file]
    puts file
  end
end
