FactoryBot.define do
  factory :user do
    # sequence(:email) { |n| "john.doe#{n}@fluid.app" }
    email { Faker::Internet.free_email }
    password {'chanxung' }
    password_confirmation { 'chanxung' }
    role {'admin'}
  end
end