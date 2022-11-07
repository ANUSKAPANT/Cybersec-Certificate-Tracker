class CertVoucher < ApplicationRecord
  belongs_to :student_course, dependent: :destroy
  has_one :exam
  validates :certification_name, presence: true
end
