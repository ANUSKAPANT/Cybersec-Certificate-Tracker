@javascript

Feature: Vendor page


    Scenario: User successfully edits a vendor record
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on vendors in the navigation menu
        When user clicks on close icon
        When user edits a CompTier record
        Then user should see success toast
    
    Scenario: User successfully adds a vendor record
        Given user is on dashboard page with data uploaded
        When user clicks the hamburger icon
        When user clicks on vendors in the navigation menu
        When user clicks on close icon
        When user clicks on add vendor record
        When user adds field name with value fake_vendor_name
        When user clicks submit button
        Then user should see success toast
