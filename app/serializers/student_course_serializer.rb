class StudentCourseSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :student_id, :course_id, :registration_date, :canvas_course_completion, :dcldp_code, :voucher_purchased, :test_result
  belongs_to :student
  belongs_to :course
  has_many :cert_vouchers
end
  