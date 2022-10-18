class StudentInfosController < ApplicationController
  before_action :set_student_info, only: [:show, :edit, :update, :destroy]
  access all: [:index, :show, :new, :edit, :create, :update, :destroy], user: :all

  # GET /student_infos
  def index
    @student_infos = StudentInfo.all
  end

  # GET /student_infos/1
  def show
  end

  # GET /student_infos/new
  def new
    @student_info = StudentInfo.new
  end

  # GET /student_infos/1/edit
  def edit
  end

  # POST /student_infos
  def create
    @student_info = StudentInfo.new(student_info_params)

    if @student_info.save
      redirect_to @student_info, notice: 'Student info was successfully created.'
    else
      render :new
    end
  end

  # PATCH/PUT /student_infos/1
  def update
    if @student_info.update(student_info_params)
      redirect_to @student_info, notice: 'Student info was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /student_infos/1
  def destroy
    @student_info.destroy
    redirect_to student_infos_url, notice: 'Student info was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_student_info
      @student_info = StudentInfo.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def student_info_params
      params.require(:student_info).permit(:first_name, :last_name, :email, :title, :registration_type, :company_name)
    end
end
