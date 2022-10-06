class CreateStudentCourses < ActiveRecord::Migration[6.0]
  def change
    create_table :student_courses do |t|
      t.references :student, null: false, foreign_key: true
      t.references :course, null: false, foreign_key: true
      t.date :registration_date
      t.boolean :canvas_course_completion
      t.string :dcldp_code
      t.boolean :voucher_purchased
      t.string :test_result

      t.timestamps
    end
  end
end
