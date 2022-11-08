class ExamsController < ApplicationController
  before_action :set_exam, only: %i[update destroy show]

  def index
    options = { include: [:cert_voucher] }
    render json: ExamSerializer.new(Exam.all, options).serialized_json
  end

  def create
    @exam = Exam.new(exam_params)
    if @exam.save
      render json: @exam, status: :created
    else
      render json: @exam.errors, status: :unprocessable_entity
    end
  end

  def show
    options = { include: [:cert_voucher] }
    render json: ExamSerializer.new(@exam, options).serialized_json, status: :ok
  end

  def update
    if @exam.update(exam_params)
      render json: @exam, status: :created
    else
      render json: @exam.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @exam.destroy
  end

  private

  def set_exam
    @exam = Exam.find(params[:id])
  end

  def exam_params
    params.permit(:cert_voucher_id, :exam_code, :exam_date, :passed, :exam_grade)
  end
end
