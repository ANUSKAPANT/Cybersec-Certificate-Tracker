class CreateCsvFiles < ActiveRecord::Migration[6.0]
  def change
    create_table :csv_files do |t|
      t.string :file_name
      t.binary :body, null:false
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
