@javascript
Feature: Course Form

  Scenario: User is on course page and submits form without course name
    Given user is on course page
    When user clicks add course button
    When user fills student form without course name
    When user submits the form
    Then user should see cant be blank field error

  Scenario: User is on course page and submits form without vendor name
    Given user is on course page
    When user clicks add course button
    When user fills student form without vendor
    When user submits the form
    Then user should see must exist error

  Scenario: User is on course page and submits form with all fields
    Given user is on course page
    When user clicks add course button
    When user fills course form
    When user submits the form
    Then user should see filled form data


