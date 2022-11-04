When("user clicks sidebar logo") do 
    page.find("body > div > nav > div > button > span").click
end

Then("user should see student panel in sidebar") do
    expect(find("#student_button > span").text).to eq 'Students'
end
