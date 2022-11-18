When ("user edits a {word} record") do |record_text|
    row = page.find(:table_row, [record_text])
    row.find('svg[data-testid="EditOutlinedIcon"]').click
    page.find('#submit').click
end
