class StudentSerializer
    include FastJsonapi::ObjectSerializer
    attributes :id, :first_name, :last_name, :canvas_id, :title, :company_id, :email_id
  end
  