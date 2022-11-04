@javascript
Feature: Sidebar

  Scenario: User clicks on Sidebar and see Student panel
    Given user is on dashboard page with data uploaded
    When user clicks sidebar logo
    Then user should see student panel in sidebar

  Scenario: User clicks on Sidebar, click on Student panel, redirected to student page
    Given user is on dashboard page with data uploaded
    When user clicks sidebar logo
    When user clicks student panel
    Then user should be redirected to student page