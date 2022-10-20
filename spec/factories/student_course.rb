FactoryBot.define do
  factory :student_course do
    registration_date { Date.today }
    canvas_course_completion { true }
    dcldp_code { SecureRandom.hex(3) }
    voucher_purchased { [true, false].sample }
    test_result { ['passed', 'failed'].sample }
    student { create(:student) }
    course { create(:course) }
  end
end