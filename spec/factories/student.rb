FactoryBot.define do
  factory :student do
    first_name { Faker::Name.first_name }
    last_name { Faker::Name.last_name }
    company { create(:company) }
    canvas_id { SecureRandom.hex(3) }
    title { ['Student', 'Manager', 'Teacher'].sample }
    email_id { Faker::Internet.email }
  end
end