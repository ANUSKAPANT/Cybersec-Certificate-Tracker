class Student < ApplicationRecord
  belongs_to :company
  has_many :student_courses, dependent: :destroy
  has_many :courses, through: :student_courses
  validates :first_name, presence: true
  validates :last_name, presence: true

  def full_comma_separated_name
    "#{first_name} #{last_name}"
  end
end
