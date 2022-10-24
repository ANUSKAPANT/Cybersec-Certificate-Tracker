class StudentSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :first_name, :last_name, :canvas_id, :title, :email_id
  belongs_to :company
  has_many :student_courses

  attribute :full_comma_separated_name
end
  