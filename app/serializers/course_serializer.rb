class CourseSerializer
    include FastJsonapi::ObjectSerializer
    attributes :id, :name, :vendor_id
  end
  