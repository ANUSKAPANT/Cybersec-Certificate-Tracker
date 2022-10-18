class CsvFileSerializer
  include FastJsonapi::ObjectSerializer
  attributes :id, :file_name, :body, :user_id
end