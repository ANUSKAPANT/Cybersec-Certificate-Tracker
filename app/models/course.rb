class Course < ApplicationRecord
  belongs_to :vendor
  has_many :student_courses
end
