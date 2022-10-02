@javascript
Feature: User signs in

  Scenario: User enters email and click sign in
    Given user entered email
    When user clicks get started button
    Then user should be told login unsuccessful