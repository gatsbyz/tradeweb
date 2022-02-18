Feature: Central Limit Order Book

  Scenario: A single valid order is accepted into the limit order book
    Given an empty orderbook for "TW"
    When the following orders are created:
      | ticker | trader | side | limit | quantity |
      | TW | trader1 | buy | $99.50 | 100 |
    Then the limit orderbook should be:
      | ticker | trader | side | limit | quantity | filledQty | status |
      | TW | trader1 | buy | $99.50 | 100 | 0 | open |
  Scenario: Multiple valid orders are accepted into the limit order book
    Given an empty order book for "TW"
    When the following orders are created:
      | ticker | trader | side | limit | quantity |
      | TW | trader1 | buy | $99.50 | 100 |
      | TW | trader2 | sell | $99.60 | 200 |
    Then the limit order book should be:
      | ticker | trader | side | limit | quantity | filledQty | status |
      | TW | trader1 | buy | $99.50 | 100 | 0 | open |
      | TW | trader2 | sell | $99.60 | 200 | 0 | open |
  Scenario: Two tradable orders result in a trade
    Given an empty order book for "TW"
    When the following orders are created:
      | ticker | trader | side | limit | quantity |
      | TW | trader1 | buy | $99.50 | 100 |
      | TW | trader2 | sell | $99.50 | 100 |
    Then the limit order book should be:
      | ticker | trader | side | limit | quantity | filledQty | status |
      | TW | trader1 | buy | $99.50 | 100 | 100 | completed |
      | TW | trader2 | sell | $99.50 | 100 | 100 | completed |
    And the following trades are created:
      | ticker | price | quantity | buyer | seller |
      | TW | $99.50 | 100 | trader1 | trader2 |
  Scenario: Two tradable orders with different quantities are partially filled
    Given an empty orderbook for "TW"
    When the following orders are created:
      | ticker | trader | side | limit | quantity |
      | TW | trader1 | buy | $99.50 | 100 |
      | TW | trader2 | sell | $99.50 | 300 |
    Then the limit orderbook should be:
      | ticker | trader | side | limit | quantity | filledQty | status |
      | TW | trader1 | buy | $99.50 | 100 | 100 | completed |
      | TW | trader2 | sell | $99.50 | 300 | 100 | open |
    And the following trades are created:
      | ticker | price | quantity | buyer | seller |
      | TW | $99.50 | 100 | trader1 | trader2 |
  Scenario: A valid single order is able to sweep the book
    Given an empty orderbook for "TW"
    When the following orders are created:
      | ticker | trader | side | limit | quantity |
      | TW | trader1 | buy | $99.50 | 100 |
      | TW | trader2 | buy | $99.45 | 300 |
      | TW | trader3 | buy | $99.35 | 500 |
      | TW | trader4 | sell | $99.30 | 1000 |
    Then the limit orderbook should be:
      | ticker | trader | side | limit | quantity | filledQty | status |
      | TW | trader1 | buy | $99.50 | 100 | 100 | completed |
      | TW | trader2 | buy | $99.45 | 300 | 300 | completed |
      | TW | trader3 | buy | $99.35 | 500 | 500 | completed |
      | TW | trader4 | sell | $99.30 | 1000 | 900 | open |
    And the following trades are created:
      | ticker | price | quantity | buyer | seller |
      | TW | $99.50 | 100 | trader1 | trader4 |
      | TW | $99.45 | 300 | trader2 | trader4 |
      | TW | $99.35 | 500 | trader3 | trader4 |
