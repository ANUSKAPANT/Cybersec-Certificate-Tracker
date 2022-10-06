class CertVoucher < ApplicationRecord
  belongs_to :student_course
  has_one :exam
end
