@javascript

Feature: Course page

    Scenario: User deletes on one of the records and the record is deleted
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on courses in the navigation menu
        When user clicks on close icon
        When user deletes a CompTier record
        Then user should see success toast

    Scenario: User successfully edits a course record
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on courses in the navigation menu
        When user clicks on close icon
        When user edits a CompTier record
        Then user should see success toast
    
    @wip
    Scenario: User successfully adds a course record
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on courses in the navigation menu
        When user clicks on close icon
        When user clicks on add course record
        When user adds field course_name with value fake_course_name
        When user clicks submit button
        Then user should see success toast
