class AddUnsavedRowsToCsvFiles < ActiveRecord::Migration[6.0]
  def change
    add_column :csv_files, :unsaved_rows, :binary
  end
end
