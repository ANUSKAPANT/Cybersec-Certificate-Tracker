class CertVoucherSerializer
    include FastJsonapi::ObjectSerializer
    attributes :id, :student_course_id, :certification_name, :created_date, :expiry_date
  end
  