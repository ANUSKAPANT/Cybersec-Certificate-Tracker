sign_in_text = "You need to sign in or sign up before continuing."
sign_in_path = "/users/sign_in"
dashboard_path = "/dashboard"
sign_in_button_text = "Submit"
unsuccessful_login_text = "Invalid Email or password."
test_email = "test@gmail.com"
test_password = "test777"
#save_and_open_page - for taking a ss and debugging

Given("user is not signed in") do
    visit "/"
end

Then("user should be told You need to sign in or sign up before continuing.") do
    expect(page.find('.alert').text).to eq(sign_in_text)
end

Then("user should be redirected to sign in page") do 
    expect(page.current_path).to eq(sign_in_path)
end

Then("user should see Get Started Button") do 
    expect(page.find('#login_button').text).to eq(sign_in_button_text)
end

Given("user is on sign in page") do
    visit sign_in_path
end

When("user enter invalid email") do
    fill_in 'email', :with => 'random@gmail.com'
end

When("user enter valid email") do
    fill_in 'email', :with => test_email
end

When("user enter invalid password") do
    fill_in 'password', :with => 'random777'
end

When("user enter valid password") do
    fill_in 'password', :with => test_password
end

When("user clicks get started button") do 
    page.find("#login_button").click
end

When("user clicks get logout") do 
    page.find("body > div > nav > div > button > span").click
    page.find("#logout_button").click
end

Then("user should be told login unsuccessful") do 
    expect(page).to have_content(unsuccessful_login_text)
end

Then("user should be told to enter email") do 
    expect(page).to have_content("Please Enter a valid email")
end

Then("user should login successful") do 
    sleep(1) # TODO: Change this hack to check for page redirection
    expect(page.current_path).to eq(dashboard_path)
end

Then("user should logout successful") do 
    expect(page.current_path).to eq(sign_in_path)
end
