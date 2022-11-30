Given("user is on student profile page") do
    visit "/"
    fill_in 'email', :with => $test_email
    fill_in 'password', :with => $test_password
    page.find("#login_button").click
    page.find("#uploadCSVButton").click
    sleep(1)
    attach_file("csvFile", 'features/test_data/canvas.csv', make_visible: true)
    sleep(1) #wait for data upload to finish in backend
    visit current_path #remove upload box
    page.find("body > div > nav > div > button > span").click
    page.find("#students_nav").click
    visit current_path 
end

When("user clicks sidebar logo") do 
    page.find("body > div > nav > div > button > span").click
end

When("user clicks student panel") do 
    sleep(1)
    page.find("#students_nav").click
end

When("user clicks add student button") do 
    page.find("#add_student_button").click
end

When("user fills student form without company") do 
    fill_in 'first_name', :with => 'manual_entry'
    fill_in 'last_name', :with => 'manual_entry'
    fill_in 'email_id', :with => 'manual_entry@gmail.com'
    fill_in 'canvas_id', :with => 'manual_entry'
end

When("user fills student form") do 
    fill_in 'first_name', :with => 'manual_entry'
    fill_in 'last_name', :with => 'manual_entry'
    fill_in 'email_id', :with => 'manual_entry@gmail.com'
    fill_in 'canvas_id', :with => 'manual_entry'
    find('#company_id').click
    find('#company_id > div', text: 'Unknown').click
end

When("user fills student form without first name") do 
    fill_in 'last_name', :with => 'manual_entry'
    fill_in 'email_id', :with => 'manual_entry@gmail.com'
    fill_in 'canvas_id', :with => 'manual_entry'
end

When("user fills student form without last name") do 
    fill_in 'first_name', :with => 'manual_entry'
    fill_in 'email_id', :with => 'manual_entry@gmail.com'
    fill_in 'canvas_id', :with => 'manual_entry'
end

When("user submits the form") do 
    page.find("#submit").click
end

Then("user should see student panel in sidebar") do
    sleep(1)
    expect(find("#students_nav").text).to eq 'Students'
end

Then("user should see student data") do
    expect(page).to have_content("dummy@tamu.edu")
end

Then("user should see missing company field error") do
    expect(page).to have_content("must exist")
end

Then("user should see cant be blank field error") do
    expect(page).to have_content("can't be blank")
end

Then("user should see filled form data") do
    visit current_path
    expect(page).to have_content("manual_entry")
end
