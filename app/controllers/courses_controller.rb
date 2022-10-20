class CoursesController < ApplicationController
    before_action :set_course, only: %i[update destroy show]
  
    def index
      render json: CourseSerializer.new(Course.all).serialized_json
    end
  
    def create
      @course = Course.new(course_params)
      if @course.save
        respond_to do |format|
          format.json  { render json: @course, status: :created }
        end
      else
        respond_to do |format|
          format.json { render json: @course.errors, status: :unprocessable_entity }
        end
      end
    end
  
    def show
      if @course.present?
        render json: CourseSerializer.new(@course).serialized_json, status: :ok
      else
        render status: :unprocessable_entity
      end
    end
  
    def update
      if @course.update(course_params)
        respond_to do |format|
          format.json  { render json: @course, status: :created }
        end
      else
        respond_to do |format|
          format.json { render json: @course.errors, status: :unprocessable_entity }
        end
      end
    end
  
    def destroy
      @course.destroy
    end
  
    def set_course
      @course = Course.find(params[:id])
    end
  
    private
  
    def course_params
      params = params.permit(:name)
    end
  end
  