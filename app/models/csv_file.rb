require 'csv'
class CsvFile < ApplicationRecord
  belongs_to :user

  def map_headers(header)
    header_map = {
      "EMAIL ADDRESS" => "email_id",
      "COMPANY NAME" => "company_name",
      "TITLE" => "title",
      "FULL NAME" => "full_name",
      "REGISTRATION TYPE" => "registration_type",
      "AMOUNT PAID" => "",
      "AMOUNT DUE" => "",
      "DISCOUNTS APPLIED" => "",
      "CERTIFICATE ISSUE DATE" => "",
      "PARTICIPANT" => "",
      "REFERENCE ID" => "reference_id",
    }
    header_map["#{header}"]
  end

  def create_records(file_path)
    converter = lambda { |header| map_headers(header) }
    csv = CSV.read(file_path, :headers => true, header_converters: converter)
    csv.each do |row|
      # company = Company.create(name: row['company_name'], smc: row['smc'] || false)
      # student = Student.create(email_id: row['email_id', first_name: row['full_name'].split(',')[1], last_name: row['full_name'].split(',')[0], company_id: company.id])
      # StudentCourse.create(student_id: student.id, )
    end
  end
end