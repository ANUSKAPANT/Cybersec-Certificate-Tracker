class DropExams < ActiveRecord::Migration[6.0]
  def change
    drop_table :exams
  end
end
