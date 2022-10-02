sign_in_text = "You need to sign in or sign up before continuing."
sign_in_path = "/users/sign_in"
sign_in_button_text = "Get Started"
unsuccessful_login_text = "Login Unsuccessful!"
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

When("user enter email") do
    visit "/"
    fill_in 'email', :with => 'random@gmail.com'
end

When("user clicks get started button") do 
    page.find("#login_button").click
end

Then("user should be told login unsuccessful") do 
    expect(page.find('#custom_alert').text).to eq(unsuccessful_login_text)
end