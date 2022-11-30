FactoryBot.define do
  factory :cert_voucher do
    student_course { create(:student_course) }
    certification_name { 'test' }
    created_date { Date.today }
    expiry_date { Date.tomorrow }
    voucher_code { SecureRandom.hex(6) }
    exam_date { Date.yesterday }
    test_result {"pass"}
    score {3}
    test_center_id {"323"}
  end
end