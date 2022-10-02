sign_in_text = "You need to sign in or sign up before continuing."
sign_in_path = "/users/sign_in"

Given("user is not signed in") do
    visit "/"
end

Then("user should be told You need to sign in or sign up before continuing.") do
    expect(page.find('.alert').text).to eq(sign_in_text)
end

Then("user should be redirected to sign in page") do 
    expect(page.current_path).to eq(sign_in_path)
    puts page.body
    #save_and_open_page
    fill_in 'email', :with => 'some text', wait: 1000000
end