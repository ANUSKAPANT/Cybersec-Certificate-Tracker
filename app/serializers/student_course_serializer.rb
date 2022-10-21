class StudentCourseSerializer
    include FastJsonapi::ObjectSerializer
    attributes :id, :student_id, :course_id, :registration_date, :canvas_course_completion, :dcldp_code, :voucher_purchased, :test_result
  end
  