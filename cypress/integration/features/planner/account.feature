Feature: Operator Planner - account persistence
  Scenario: Users can sign up for an account
    Given I am not logged in
    When I click the "Sign Up" button
    Then I should see a registration window

  Scenario: Users can log in with their existing account
    When I click the "Log In" button
    And I enter my account information
    And click "Log In"
    Then I should see that I'm logged in

  Scenario: When a user registers, their current data is saved
    Given I am not logged in
    When I register for an account
    Then my planner should be bound to my account

  Scenario: When a user logs in, their previous data is loaded
    When I log into my account
    Then I should see my previous data

  Scenario: User data is updated when they make a change to their planner
    Given I have logged into my account
    When I make a change to the planner
    Then that change should be saved to my account
