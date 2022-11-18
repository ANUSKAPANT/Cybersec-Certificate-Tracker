When("user clicks on add {word} record") do |record_text|
    page.find("#add_#{record_text}_button").click

end

When("user adds field {word} with value {word}") do |field_name, field_value|
    page.find("##{field_name}").set(field_value)
end