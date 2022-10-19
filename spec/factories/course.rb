FactoryBot.define do
  factory :course do
    name {Faker::Educator.course_name}
    vendor{create(:vendor)}
  end
end