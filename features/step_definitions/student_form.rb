Given("user is on student profile page") do
    visit "/"
    fill_in 'email', :with => $test_email
    fill_in 'password', :with => $test_password
    page.find("#login_button").click
    page.find("#uploadCSVButton").click
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
    page.find("#students_nav").click
end

When("user clicks add student button") do 
    page.find("#add_student_button").click
end

When("user fills the form") do 
    fill_in 'first_name', :with => 'manual_entry'
    fill_in 'last_name', :with => 'manual_entry'
    fill_in 'email', :with => 'manual_entry@gmail.com'
    fill_in 'company_id', :with => '1'
    fill_in 'title', :with => 'manual_entry'
    fill_in 'canvas_id', :with => 'manual_entry'
end

When("user submits the form") do 
    page.find("#form_submit").click
end

Then("user should see student panel in sidebar") do
    expect(find("#students_nav > span").text).to eq 'Students'
end

Then("user should see student data") do
    expect(page).to have_content("dummy@tamu.edu")
end

Then("user should see filled form data") do
    visit current_path
    expect(page).to have_content("manual_entry")
end
