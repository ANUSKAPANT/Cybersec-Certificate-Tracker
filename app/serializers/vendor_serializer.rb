class VendorSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name
  has_many :courses
end
