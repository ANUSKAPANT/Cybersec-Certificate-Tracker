@javascript

Feature: Course page
    Scenario: User deletes on one of the records and the record is deleted
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on courses in the navigation menu
        When user clicks on overlay
        When user deletes a CompTier record
        Then user should see success toast
