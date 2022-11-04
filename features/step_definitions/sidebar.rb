When("user clicks sidebar logo") do 
    page.find("body > div > nav > div > button > span").click
end

When("user clicks student panel") do 
    page.find("#student_button").click
end

Then("user should see student panel in sidebar") do
    expect(find("#student_button > span").text).to eq 'Students'
end

Then("user should be redirected to student page") do
    expect(page.current_path).to eq($student_sidebar_path)
end

Then("user should see student data") do
    expect(page).to have_content("dummy@tamu.edu")
end

