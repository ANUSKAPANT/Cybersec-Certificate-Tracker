class CertVoucher < ApplicationRecord
  belongs_to :student_course, optional: true
  validates :certification_name, presence: true
  validates :voucher_code, uniqueness: true
  validates :test_result, { in: %w(pass fail TBD),
    message: "%{value} is not a valid test_result" }
end
