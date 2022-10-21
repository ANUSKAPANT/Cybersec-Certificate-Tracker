class StudentCoursesController < ApplicationController
  before_action :set_student_course, only: %i[update destroy show]

  def index
    render json: StudentCourseSerializer.new(StudentCourse.all).serialized_json
  end

  def create
    @student_course = StudentCourse.new(student_course_params)
    if @student_course.save
      respond_to do |format|
        format.json  { render json: @student_course, status: :created }
      end
    else
      respond_to do |format|
        format.json { render json: @student_course.errors, status: :unprocessable_entity }
      end
    end
  end

  def show
    if @student_course.present?
      render json: StudentCourseSerializer.new(@student_course).serialized_json, status: :ok
    else
      render status: :unprocessable_entity
    end
  end

  def update
    if @student_course.update(student_course_params)
      respond_to do |format|
        format.json  { render json: @student_course, status: :created }
      end
    else
      respond_to do |format|
        format.json { render json: @student_course.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @student_course.destroy
  end

  def set_student_course
    @student_course = StudentCourse.find(params[:id])
  end

  private

  def student_course_params(params)
    params = params.permit(:student_id, :course_id, :registration_date, :canvas_course_completion, :dcldp_code, :voucher_purchased, :test_result)
  end
end
