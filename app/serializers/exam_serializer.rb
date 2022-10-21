class ExamSerializer
    include FastJsonapi::ObjectSerializer
    attributes :id, :cert_voucher_id, :exam_code, :exam_date, :passed, :exam_grade
  end
  