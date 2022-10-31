Given("user is on dashboard page with data uploaded") do
    visit "/"
    fill_in 'email', :with => $test_email
    fill_in 'password', :with => $test_password
    page.find("#login_button").click
    page.find("#uploadCSVButton").click
    attach_file("csvFile", 'features/test_data/canvas.csv', make_visible: true)
    sleep(1) #wait for data upload to finish in backend
    page.find('body').click #remove upload box
end

When("user clicks a table row") do
    page.find(:table_row, ["dummy@tamu.edu"]).click
end

Then("user should see be redirected to student->profile") do 
    expect(page.current_path).to eq($student_profile_path)
end