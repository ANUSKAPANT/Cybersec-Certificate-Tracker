test_email = "test@gmail.com"
test_password = "test777"

Given("user is on dashboard page") do
    visit "/"
    fill_in 'email', :with => test_email
    fill_in 'password', :with => test_password
    page.find("#login_button").click
end

When("user uploads a csv") do
    attach_file('csvFile', 'features/test_data/test.csv')
end

Then("user should see success toast") do
    expect(page).to have_content("Success")
end
