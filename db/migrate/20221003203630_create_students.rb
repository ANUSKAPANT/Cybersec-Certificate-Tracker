class CreateStudents < ActiveRecord::Migration[6.0]
  def change
    create_table :students do |t|
      t.string :first_name
      t.string :last_name
      t.string :canvas_id
      t.string :title
      t.references :company, null: false, foreign_key: true
      t.string :email_id

      t.timestamps
    end
  end
end
