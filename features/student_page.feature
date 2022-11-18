@javascript

Feature: Student page

    Scenario: User deletes on one of the records and the record is deleted
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on students in the navigation menu
        When user clicks on close icon
        When user deletes a dummy record
        Then user should see success toast

    Scenario: User successfully edits a student record
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on students in the navigation menu
        When user clicks on close icon
        When user edits a dummy record
        Then user should see success toast
    
    @wip
    Scenario: User successfully adds a student record
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on students in the navigation menu
        When user clicks on close icon
        When user clicks on add student record
        When user adds field first_name with value fake_first_name
        When user adds field last_name with value fake_last_name
        When user adds field email_id with value fake@email.id
        When user clicks submit button
        Then user should see success toast