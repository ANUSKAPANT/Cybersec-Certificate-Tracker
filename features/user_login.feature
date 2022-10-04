@javascript
Feature: User signs in

  Scenario: User enters valid email and click sign in
    Given user is on sign in page
    When user enter valid email
    When user clicks get started button
    Then user should be told login unsuccessful

  Scenario: User enters valid password and click sign in
    Given user is on sign in page
    When user enter valid password
    When user clicks get started button
    Then user should be told login unsuccessful

  Scenario: User enters invalid email and invalid password and click sign in
    Given user is on sign in page
    When user enter invalid email
    When user enter invalid password
    When user clicks get started button
    Then user should be told login unsuccessful

  Scenario: User enters valid email and invalid password and click sign in
    Given user is on sign in page
    When user enter valid email
    When user enter invalid password
    When user clicks get started button
    Then user should be told login unsuccessful

  Scenario: User enters invalid email and valid password and click sign in
    Given user is on sign in page
    When user enter invalid email
    When user enter valid password
    When user clicks get started button
    Then user should be told login unsuccessful

  Scenario: User enters valid email, password and click sign in
    Given user is on sign in page
    When user enter valid email
    When user enter valid password
    When user clicks get started button
    Then user should login successful