@javascript

Feature: Company page
    @wip
    Scenario: User deletes on one of the records and the record is deleted
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on companies in the navigation menu
        When user clicks on close icon
        When user deletes a Unknown record
        Then user should see success toast

    Scenario: User successfully edits a company record
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on companies in the navigation menu
        When user clicks on close icon
        When user edits a Unknown record
        Then user should see success toast
    
    Scenario: User successfully adds a company record
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on companies in the navigation menu
        When user clicks on close icon
        When user clicks on add company record
        When user adds field name with value fake_company_name
        When user clicks submit button
        Then user should see success toast
