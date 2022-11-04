When("user clicks on overlay") do
    sleep(1)
    page.find('div[data-testid="overlay-test-id"]').click
end

Then("user deletes a {word} record") do |record_text|
    row = page.find(:table_row, [record_text])
    row.find('svg[data-testid="RemoveCircleOutlineOutlinedIcon"]').click
end