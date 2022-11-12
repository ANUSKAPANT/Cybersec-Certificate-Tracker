class RecordsController < BaseController
  skip_before_action :authorize_admin
  def index
    all_records = {}
    all_record_rows = []

    StudentCourse.includes(:student, :course).all.each do |student_course|
      record_row = {}
      record_row[:stucourse_id] = student_course.id
      record_row[:participant_id] = student_course.student_id
      record_row[:full_name] = student_course.student.full_comma_separated_name
      record_row[:email_address] = student_course.student.email_id
      record_row[:company_name] = student_course.student.company.name
      record_row[:title] = student_course.student.title
      record_row[:canvas_course_enrollment] = student_course.course.name
      record_row[:canvas_course_progress] = student_course.canvas_course_completion #doubt
      record_row[:cc_email] = nil
      record_row[:registration_date] = student_course.registration_date
      record_row[:smc] = student_course.student.company.smc
      record_row[:dcldp_code] = student_course.dcldp_code
      record_row[:voucher_purchased] = student_course.voucher_purchased
      record_row[:test_result] = student_course.test_result
      record_row[:test_center_id] = nil
      record_row[:scaled_score] = nil
      record_row[:percent_score] = nil
      record_row[:other_notes] = nil

      if student_course.cert_vouchers.present?
        student_course.cert_vouchers.each do |cert_voucher|
          cloned_record_row = record_row
          cloned_record_row[:cert_name] = cert_voucher.certification_name
          cloned_record_row[:cert_voucher_id] = cert_voucher.id
          cloned_record_row[:voucher_use_by] = cert_voucher.expiry_date
          cloned_record_row[:exam_code] = cert_voucher.exam&.exam_code
          cloned_record_row[:exam_date] = cert_voucher.exam&.exam_date
          cloned_record_row[:exam_grade] = cert_voucher.exam&.exam_grade
          all_record_rows << cloned_record_row
        end
      else
        [:cert_name, :cert_voucher_id, :voucher_use_by, :exam_code, :exam_date, :exam_grade].each do |attr|
          record_row[attr] = nil
        end
        all_record_rows << record_row
      end

    end

    all_records[:records] = all_record_rows

    render json: all_records.to_json
  end
end