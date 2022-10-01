sign_in_text = "You need to sign in or sign up before continuing."

Given("user is not signed in") do
visit "/"
end

Then("I should be told You need to sign in or sign up before continuing.") do
expect(page.find('.alert').text).to eq(sign_in_text)
end