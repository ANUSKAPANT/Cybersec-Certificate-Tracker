class StudentCourse < ApplicationRecord
  belongs_to :student
  belongs_to :course
  has_many :cert_vouchers, dependent: :destroy
end
