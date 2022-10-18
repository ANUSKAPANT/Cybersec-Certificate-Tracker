json.extract! student_info, :id, :first_name, :last_name, :email, :title, :registration_type, :company_name, :created_at, :updated_at
json.url student_info_url(student_info, format: :json)
