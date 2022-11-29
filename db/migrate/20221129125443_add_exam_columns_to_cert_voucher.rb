class AddExamColumnsToCertVoucher < ActiveRecord::Migration[6.0]
  def change
    add_column :cert_vouchers, :exam_code, :string
    add_column :cert_vouchers, :exam_date, :string
    add_column :cert_vouchers, :date, :string
    add_column :cert_vouchers, :test_result, :string
    add_column :cert_vouchers, :score, :int
    add_column :cert_vouchers, :test_center_id, :string
  end
end
