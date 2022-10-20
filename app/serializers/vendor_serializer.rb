class VendorSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :name
end
