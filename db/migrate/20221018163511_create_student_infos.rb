class CreateStudentInfos < ActiveRecord::Migration[6.0]
  def change
    create_table :student_infos do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :title
      t.string :registration_type
      t.string :company_name

      t.timestamps
    end
  end
end
