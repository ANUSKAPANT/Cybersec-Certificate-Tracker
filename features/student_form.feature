@javascript
Feature: Sidebar

  Scenario: User clicks on Sidebar and see Student panel
    Given user is on dashboard page with data uploaded
    When user clicks sidebar logo
    Then user should see student panel in sidebar

  Scenario: User clicks on Sidebar, click on Student panel, redirected to student page, and see student data
    Given user is on dashboard page with data uploaded
    When user clicks sidebar logo
    When user clicks student panel
    Then user should see student data

  Scenario: User is on student profile page and submits form without company
    Given user is on student profile page
    When user clicks add student button
    When user fills student form without company
    When user submits the form
    Then user should see missing company field error

  Scenario: User is on student profile page and submits form without first name
    Given user is on student profile page
    When user clicks add student button
    When user fills student form without first name
    When user submits the form
    Then user should see cant be blank field error

  Scenario: User is on student profile page and submits form without last name
    Given user is on student profile page
    When user clicks add student button
    When user fills student form without last name
    When user submits the form
    Then user should see cant be blank field error

  Scenario: User is on student profile page and submits form with all fields
    Given user is on student profile page
    When user clicks add student button
    When user fills student form
    When user submits the form
    Then user should see filled form data


