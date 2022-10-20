class ExamsController < ApplicationController
    before_action :set_exam, only: %i[update destroy show]
  
    def index
      render json: ExamSerializer.new(Exam.all).serialized_json
    end
  
    def create
      @exam = Exam.new(exam_params)
      if @exam.save
        respond_to do |format|
          format.json  { render json: @exam, status: :created }
        end
      else
        respond_to do |format|
          format.json { render json: @exam.errors, status: :unprocessable_entity }
        end
      end
    end
  
    def show
      if @exam.present?
        render json: ExamSerializer.new(@exam).serialized_json, status: :ok
      else
        render status: :unprocessable_entity
      end
    end
  
    def update
      if @exam.update(exam_params)
        respond_to do |format|
          format.json  { render json: @exam, status: :created }
        end
      else
        respond_to do |format|
          format.json { render json: @exam.errors, status: :unprocessable_entity }
        end
      end
    end
  
    def destroy
      @exam.destroy
    end
  
    def set_exam
      @exam = Exam.find(params[:id])
    end
  
    private
  
    def exam_params
      params = params.permit(:name)
    end
  end
  