@javascript

Feature: Student page

    Scenario: User deletes on one of the records and the record is deleted
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on students in the navigation menu
        When user clicks on close icon
        When user deletes a dummy record
        Then user should see success toast

    Scenario: User clicks on edit and a form modal pops up
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on students in the navigation menu
        When user clicks on close icon
        When user edits a dummy record
        Then user should see success toast
