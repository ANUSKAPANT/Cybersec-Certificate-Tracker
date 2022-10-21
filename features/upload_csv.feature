@javascript
Feature: User uploads csv

  Scenario: User clicks on upload csv button and adds a empty csv file
    Given user is on dashboard page
    When user uploads a empty csv
    Then user should see success toast

  Scenario: User clicks on upload csv button and adds a data csv file
    Given user is on dashboard page
    When user uploads a data csv
    When user refreshes the page
    Then user should see data in table