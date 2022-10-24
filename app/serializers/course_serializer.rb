class CourseSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name
  # has_many :students
  belongs_to :vendor
end
  