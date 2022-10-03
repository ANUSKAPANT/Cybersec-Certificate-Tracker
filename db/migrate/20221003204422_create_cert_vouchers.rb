class CreateCertVouchers < ActiveRecord::Migration[6.0]
  def change
    create_table :cert_vouchers do |t|
      t.references :student_course, null: false, foreign_key: true
      t.string :certification_name
      t.date :created_date
      t.date :expiry_date

      t.timestamps
    end
  end
end
