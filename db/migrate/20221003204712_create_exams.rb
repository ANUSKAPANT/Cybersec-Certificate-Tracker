class CreateExams < ActiveRecord::Migration[6.0]
  def change
    create_table :exams do |t|
      t.references :cert_voucher, null: false, foreign_key: true
      t.string :exam_code
      t.date :exam_date
      t.boolean :passed
      t.float :exam_grade

      t.timestamps
    end
  end
end
