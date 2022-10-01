Feature: User is asked to sign in
  Unauthorised user is shown sign in page

  Scenario: User opens the webpage "/"
    Given user is not signed in
    Then I should be told You need to sign in or sign up before continuing.