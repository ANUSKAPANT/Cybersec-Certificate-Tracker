@javascript
Feature: User signs in

  Scenario: User enters email and click sign in
    Given user is on sign in page
    When user enter email
    When user clicks get started button
    Then user should be told login unsuccessful

  Scenario: User enters valid email, password and click sign in
    Given user is on sign in page
    When user enter valid email
    When user enter valid password
    When user clicks get started button
    Then user should login successful