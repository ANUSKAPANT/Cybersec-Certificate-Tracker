Given("user is on course page") do
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
    page.find("#courses_nav").click
    visit current_path 
end

When("user clicks add course button") do 
    page.find("#add_course_button").click
end

When("user fills student form without course name") do 
end

When("user fills student form without vendor") do 
    fill_in 'course_name', :with => 'manual_entry_course'
end

When("user fills course form") do 
    fill_in 'course_name', :with => 'manual_entry_course'
    find('#vendor_id').click
    find('#vendor_id > div', text: 'CompTier').click
end


