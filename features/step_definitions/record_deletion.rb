When("user clicks on close icon") do
    sleep(1)
    page.find('svg[data-testid="CloseIcon"]').click
end

When("user deletes a {word} record") do |record_text|
    row = page.find(:table_row, [record_text])
    row.find('svg[data-testid="RemoveCircleOutlineOutlinedIcon"]').click
    page.find("#confirm_delete").click
end