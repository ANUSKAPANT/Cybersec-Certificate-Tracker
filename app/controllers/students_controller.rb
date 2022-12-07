class StudentsController < BaseController
  before_action :set_student, only: %i[update destroy show]
  skip_before_action :authorize_admin, only: %i[index show]

  def index
    options = { include: [:company, :student_courses, "student_courses.cert_vouchers", "student_courses.cert_vouchers.exam", "student_courses.course.vendor"] }
    render json: StudentSerializer.new(Student.all, options).serialized_json
  end

  def create
    options = { include: [:company, :student_courses, "student_courses.cert_vouchers", "student_courses.cert_vouchers.exam", "student_courses.course.vendor"] }
    @student = Student.new(student_params)
    if @student.save
      render json: StudentSerializer.new(@student, options).serialized_json
    else
      render json: @student.errors, status: :unprocessable_entity
    end
  end

  def show
    options = { include: [:company, :student_courses, "student_courses.cert_vouchers", "student_courses.cert_vouchers.exam", "student_courses.course.vendor"] }
    render json: StudentSerializer.new(@student, options).serialized_json, status: :ok
  end

  def update
    options = { include: [:company, :student_courses, "student_courses.cert_vouchers", "student_courses.cert_vouchers.exam", "student_courses.course.vendor"] }
    if @student.update(student_params)
      render json: StudentSerializer.new(@student, options).serialized_json
    else
      render json: @student.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @student.destroy
  end

  private

  def set_student
    @student = Student.find(params[:id])
  end

  def student_params
    params.permit(:first_name, :last_name, :canvas_id, :title, :company_id, :email_id)
  end
end
