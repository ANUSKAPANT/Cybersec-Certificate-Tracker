class CertVoucher < ApplicationRecord
  belongs_to :student_course, optional: true
  has_one :exam, dependent: :destroy
  validates :certification_name, presence: true
end
