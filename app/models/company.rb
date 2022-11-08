class Company < ApplicationRecord
    has_many :students, dependent: :nullify
    validates :name, presence: true
end
