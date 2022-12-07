class CoursesController < BaseController
  before_action :set_course, only: %i[update destroy show]

  def index
    options = { include: [:vendor] }
    render json: CourseSerializer.new(Course.all, options).serialized_json
  end

  def create
    options = { include: [:vendor] }
    @course = Course.new(course_params)
    if @course.save
      render json: CourseSerializer.new(@course, options).serialized_json
    else
      render json: @course.errors, status: :unprocessable_entity
    end
  end

  def show
    options = { include: [:vendor] }
    render json: CourseSerializer.new(@course, options).serialized_json, status: :ok
  end

  def update
    options = { include: [:vendor] }
    if @course.update(course_params)
      render json: CourseSerializer.new(@course, options).serialized_json
    else
      render json: @course.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @course.destroy
  end

  private
  
  def set_course
    @course = Course.find(params[:id])
  end

  def course_params
    params.permit(:name, :vendor_id)
  end
end
  