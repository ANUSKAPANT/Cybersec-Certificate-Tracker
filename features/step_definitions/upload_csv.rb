Given("user is on dashboard page") do
    visit "/"
    fill_in 'email', :with => $test_email
    fill_in 'password', :with => $test_password
    page.find("#login_button").click
end

When("user uploads a empty csv") do
    attach_file('csvFile', 'features/test_data/empty.csv')
end

When("user uploads a data csv") do
    attach_file('csvFile', 'features/test_data/data.csv')
    sleep(1) #wait for data upload to finish in backend
    expect(page).to have_content("Success")
end

When("user refreshes the page") do
    visit current_path
end

Then("user should see success toast") do
    expect(page).to have_content("Success")
end

Then("user should see data in table") do
    expect(page).to have_content("dummy@tamu.edu")
end