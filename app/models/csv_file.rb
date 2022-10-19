require 'csv'
class CsvFile < ApplicationRecord
  belongs_to :user

  def map_headers(header)
    header_map = {
      "EMAIL ADDRESS" => "email_id",
      "COMPANY NAME" => "company_name",
      "TITLE" => "title",
      "FULL NAME" => "full_name_tees",
      "REGISTRATION TYPE" => "registration_type",
      "AMOUNT PAID" => "",
      "AMOUNT DUE" => "",
      "DISCOUNTS APPLIED" => "",
      "CERTIFICATE ISSUE DATE" => "",
      "PARTICIPANT" => "",
      "REFERENCE ID" => "reference_id",
      "STUDENT EMAIL" => "email_id" ,
      "STUDENT NAME" => "full_name_canvas",
      "CREATED AT" => "course_registration_date",
      "LISTING NAME"=> "course_name",
    }
    header_map["#{header}"]
  end

  def add_company_record(row)
    Company.find_by(name: row['company_name']) || Company.create(name: row['company_name'], smc: row['smc'] || false)
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
    end
  end
end