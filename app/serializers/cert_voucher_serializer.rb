class CertVoucherSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :student_course_id, :certification_name, :created_date, :expiry_date, :exam_code, :exam_date, :voucher_code, :test_result, :test_center_id, :score
  belongs_to :student_course
end
