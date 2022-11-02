class Course < ApplicationRecord
  belongs_to :vendor
  has_many :student_courses, dependent: :delete_all
  has_many :students, through: :student_courses
  validates :name, presence: true
end
