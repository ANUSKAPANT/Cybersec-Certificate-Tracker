class StudentInfoSerializer < ActiveModel::Serializer
  attributes :id, :first_name, :last_name, :email, :title, :registration_type, :company_name
end
