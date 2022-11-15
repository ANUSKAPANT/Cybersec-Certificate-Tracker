@javascript
Feature: Navigation

  Scenario: User clicks on hamburger icon and sees the navigation menu
    Given user is on dashboard page with data uploaded
    When user clicks the hamburger icon
    Then user should see the navigation menu

  Scenario: User clicks on the students in the navigation menu and is redirected to students page
    Given user is on dashboard page with data uploaded
    When user clicks the hamburger icon
    When user clicks on students in the navigation menu
    Then user should be redirected to students page

  Scenario: User clicks on the courses in the navigation menu and is redirected to courses page
    Given user is on dashboard page with data uploaded
    When user clicks the hamburger icon
    When user clicks on courses in the navigation menu
    Then user should be redirected to courses page

  Scenario: User clicks on the cert_vouchers in the navigation menu and is redirected to cert_vouchers page
    Given user is on dashboard page with data uploaded
    When user clicks the hamburger icon
    When user clicks on cert_vouchers in the navigation menu
    Then user should be redirected to cert_vouchers page
  
  Scenario: User clicks on the exams in the navigation menu and is redirected to exams page
    Given user is on dashboard page with data uploaded
    When user clicks the hamburger icon
    When user clicks on exams in the navigation menu
    Then user should be redirected to exams page

  Scenario: User clicks on the vendors in the navigation menu and is redirected to vendors page
    Given user is on dashboard page with data uploaded
    When user clicks the hamburger icon
    When user clicks on vendors in the navigation menu
    Then user should be redirected to vendors page

  @wip
  Scenario: User clicks on the users in the navigation menu and is redirected to users page
    Given user is on dashboard page with data uploaded
    When user clicks the hamburger icon
    When user clicks on users in the navigation menu
    Then user should be redirected to users page