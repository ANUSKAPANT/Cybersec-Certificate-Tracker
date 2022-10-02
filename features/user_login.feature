@javascript
Feature: User signs in

  Scenario: User enters email and click sign in
    Given user is on sign in page
    When user enter email
    When user clicks get started button
    Then user should be told login unsuccessful