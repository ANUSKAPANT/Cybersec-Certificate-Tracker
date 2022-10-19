@javascript
Feature: User uploads csv

  Scenario: User clicks on upload csv button and adds a csv file
    Given user is on dashboard page
    When user uploads a csv
    Then user should see success toast