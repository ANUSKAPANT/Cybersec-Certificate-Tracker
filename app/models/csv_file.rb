require 'csv'
class CsvFile < ApplicationRecord
  belongs_to :user

  def map_headers(header)
    header_map = {
      "EMAIL ADDRESS" => "email_id",
      "EMAIL_ADDRESS" => "email_id",
      "COMPANY NAME" => "company_name",
      "COMPANY" => "company_name",
      "COURSE_NAME" => "course_name",
      "REGISTRATION_DATE" => "course_registration_date",
      "DCLDP_CODE" => "DCLDP_code",
      "VOUCHER_PURCHASED" => "voucher_purchased",
      "VOUCHER_CODE" => "voucher_code",
      "CERT_NAME" => "cert_name",
      "EXAM_CODE" => "exam_code",
      "EXAM_DATE" => "exam_date",
      "TEST_RESULT" => "test_result",
      "SCORE" => "score",
      "TEST_CENTER_ID" => "test_center_id",
      "TITLE" => "title",
      "FULL NAME" => "full_name_tees",
      "FIRST_NAME" => "first_name",
      "LAST_NAME" => "last_name",
      "REGISTRATION TYPE" => "registration_type",
      "STUDENT EMAIL" => "email_id" ,
      "STUDENT NAME" => "full_name_canvas",
      "CREATED AT" => "course_registration_date",
      "LISTING NAME"=> "course_name",
      "CANVAS USER ID" => "canvas_id",
      "CANVAS_ID" => "canvas_id",
      "COMPLETED AT" => "course_completion"
    }
    header_map["#{header}"]
  end

  def add_company_record(row)
    Company.find_by(name: row['company_name']) || Company.create(name: row['company_name'], smc: row['smc'] || false)
  end

  def create_or_update_student_record(row, company)
    student = Student.find_by(email_id: row['email_id'])
    if row['full_name_tees']
      first_name = row['full_name_tees'].split(',')[1]
      last_name = row['full_name_tees'].split(',')[0]
    elsif row ['full_name_canvas']
      first_name = row['full_name_canvas'].split(' ')[0]
      last_name = row['full_name_canvas'].split(' ')[-1]
    elsif row['first_name']
      first_name = row['first_name']
      last_name = row['last_name']
    end
    if student
      # don't replace company name by unknown if already present
      # can happen when canvas is uploaded after TEES edge
      if company.name == 'Unknown'
        company.id = student.company_id
      end
      # don't replace title by null if already present
      # can happen if canvas is uploaded after tees edge
      if not row['title']
        row['title'] = student.title
      end
      # don't replace title by null if already present
      # can happen if tees edge is uploaded after canvas
      if not row['canvas_id']
        row['canvas_id'] = student.canvas_id
      end
      student.update(email_id: row['email_id'], first_name: first_name, last_name: last_name, title:row['title'], canvas_id: row['canvas_id'], company_id: company.id)
    else
      student = Student.create(email_id: row['email_id'], first_name: first_name, last_name: last_name, title:row['title'], canvas_id: row['canvas_id'], company_id: company.id)
    end
    student
  end

  def create_or_update_course_record(row)
    vendor = Vendor.find_by(name: "CompTier") # only one vendor for now
    if row['full_name_canvas'] or row['first_name']
      course = Course.find_by(name: row['course_name']) || Course.create(name: row['course_name'], vendor_id: vendor.id)
    end
    course
  end

  def add_student_course(row, student, course)
    return unless student && course
    std_course = StudentCourse.find_by(student_id: student.id, course_id:course.id)
    if not std_course
      course_completion = row['course_completion'] != nil && row['course_completion'] != ""
      if row['full_name_canvas']
        date_format = "%m/%d/%Y %H:%M"
      elsif row['first_name']
        date_format = "%Y-%m-%d"
      end
      print(row["course_registration_date"])
      registration_date = DateTime.strptime(row["course_registration_date"], date_format)
      std_course = StudentCourse.create(student_id: student.id, course_id: course.id, registration_date: registration_date, canvas_course_completion: course_completion )
    end
    # add dummy cert voucher information
    # dummy_cert_names = [" Certified Information Systems Security Professional (CISSP)",
    #                     "Certified Information Systems Auditor (CISA)",
    #                     "Certified Information Security Manager (CISM)",
    #                     "CompTIA Security+",
    #                     "Certified Ethical Hacker (CEH)",
    #                     "GIAC Security Essentials Certification (GSEC)",
    #                     "Systems Security Certified Practitioner (SSCP)",
    #                     "CompTIA Advanced Security Practitioner (CASP+)",
    #                     "GIAC Certified Incident Handler (GCIH)",
    #                     "Offensive Security Certified Professional (OSCP)"
    #                   ]
    # if row['course_completion']!=nil
    #   std_course.update(voucher_purchased: true)
    #   created_date = DateTime.strptime(row['course_completion'], "%m/%d/%Y %H:%M")
    #   cert_voucher = CertVoucher.create(student_course_id: std_course.id,
    #                                   certification_name: dummy_cert_names.sample(), 
    #                                   created_date:created_date, 
    #                                   expiry_date: DateTime.now-rand(30), 
    #                                   test_result: "pass", score: 90, 
    #                                   voucher_code: (0...8).map { (65 + rand(26)).chr }.join,
    #                                   test_center_id: "KYLE_FIELD_204"
    #                                 )
    if row['first_name']
      # debugger
      std_course.update(voucher_purchased: row['voucher_purchased']=="true")
      debugger
      cert_voucher = CertVoucher.create(student_course_id: std_course.id,
                                        certification_name: row['cert_name'], 
                                        test_result: (row['test_result']==nil or row['test_result']=="") ? "TBD" : row['test_result'], score: row["score"]=="N/A" ? nil : (row["score"].to_i), 
                                        voucher_code: row['voucher_code'],
                                        test_center_id: row['test_center_id'],
                                        exam_date: row['exam_date'],
                                        exam_code: row['exam_code'],
                                      )
    end
  end

  def create_records(file_path)
    converter = lambda { |header| map_headers(header.upcase) }
    file = File.open(file_path, "r:bom|utf-8")
    csv = CSV.parse(file, :headers => true, header_converters: converter)
    csv.each do |row|
      # add company
      if not row['company_name'] || row['company_name']==''
        row['company_name'] = 'Unknown'
      end
      company = add_company_record(row)  
      # add student
      student = create_or_update_student_record(row, company)
      # add course
      course = create_or_update_course_record(row)
      # add student course
      add_student_course(row, student, course)

    end
  end
end