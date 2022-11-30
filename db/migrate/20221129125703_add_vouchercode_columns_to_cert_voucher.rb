class AddVouchercodeColumnsToCertVoucher < ActiveRecord::Migration[6.0]
  def change
    add_column :cert_vouchers, :voucher_code, :string
  end
end
