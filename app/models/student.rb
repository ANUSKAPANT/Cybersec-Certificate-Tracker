class Student < ApplicationRecord
  belongs_to :company
  has_many :student_courses
end
