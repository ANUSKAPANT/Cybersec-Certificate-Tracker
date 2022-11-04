@javascript
Feature: Student Profile

  Scenario: User clicks on table record and is redirected to student profile page
    Given user is on dashboard page with data uploaded
    When user clicks a table row
    Then user should see be redirected to student->profile

  Scenario: User clicks on table record and is redirected to student profile page and see dummy details
    Given user is on dashboard page with data uploaded
    When user clicks a table row
    Then user should see dummy email record details
