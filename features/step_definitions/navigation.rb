When("user clicks the hamburger icon") do
    page.find('.navbar-toggler-icon').click
end

When('user clicks on {word} in the navigation menu') do |menu_item|
    page.find("##{menu_item}_nav").click
end

Then("user should see the navigation menu") do 
    ['Students', 'Courses', 'Companies', 'Certificate Vouchers', 'Exams', 'Vendors', 'Users'].each do |menu_item|
        expect(page).to have_content(menu_item)
    end 
end

Then("user should be redirected to {word} page") do |menu_item| 
    expect(page.current_path).to eq("/dashboard/#{menu_item}")
end
