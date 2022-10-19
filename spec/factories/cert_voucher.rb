FactoryBot.define do
  factory :cert_voucher do
    student_course { create(:student_course) }
    certification_name { 'test' }
    created_date { Date.today }
    expiry_date { Date.tomorrow }
  end
end