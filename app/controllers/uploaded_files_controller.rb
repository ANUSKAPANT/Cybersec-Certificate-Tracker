class UploadedFilesController < ApplicationController
  before_action :authenticate_user!

  def create()
    puts request.body.read  
    render json: {success: true}
  end
end
