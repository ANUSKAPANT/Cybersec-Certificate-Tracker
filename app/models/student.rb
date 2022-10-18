class Student < ApplicationRecord
  belongs_to :company
  has_many :student_courses
  validates :email_id, presence: true, uniqueness: true
end
