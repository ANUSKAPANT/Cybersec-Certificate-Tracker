class StudentsController < ApplicationController
  before_action :set_student, only: %i[update destroy show]

  def index
    render json: StudentSerializer.new(Student.all).serialized_json
  end

  def create
    @student = Student.new(student_params)
    if @student.save
      respond_to do |format|
        format.json  { render json: @student, status: :created }
      end
    else
      respond_to do |format|
        format.json { render json: @student.errors, status: :unprocessable_entity }
      end
    end
  end

  def show
    if @student.present?
      render json: StudentSerializer.new(@student).serialized_json, status: :ok
    else
      render status: :unprocessable_entity
    end
  end

  def update
    if @student.update(student_params)
      respond_to do |format|
        format.json  { render json: @student, status: :created }
      end
    else
      respond_to do |format|
        format.json { render json: @student.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @student.destroy
  end

  def set_student
    @student = Student.find(params[:id])
  end

  private

  def student_params
    params = params.require(:student).permit(:first_name, :last_name, :canvas_id, :title, :company_id, :email_id)
  end
end
