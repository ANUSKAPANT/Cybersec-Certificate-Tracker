FactoryBot.define do
  factory :company do
    name { Faker::Company.name }
    smc { [true, false].sample }
  end
end