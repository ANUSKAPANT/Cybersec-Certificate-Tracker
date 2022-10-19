FactoryBot.define do
  factory :exam do
    cert_voucher { create(:cert_voucher) }
    exam_code { SecureRandom.hex(4) }
    exam_date { Date.yesterday }
    passed { [true, false].sample }
    exam_grade { rand(10) }
  end
end