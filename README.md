npm i 
npm start

Node.JS New Hire Coding Assignment  
• Project setup - It should run out of the box with a simple "npm install" and "npm start" commands. Does  your README file give good instructions on how to pull down and run your application? Are there simple  instructions to run the system and execute unit tests?
• Code Architecture & Quality - We like simple and easy to follow. How legible is your code? Are we able to  follow control flow? Are you using appropriate patterns to solve problems?
• Team Collaboration - Ask questions. How was communication during the assignment. Were there regular updates of progress and did you seek incremental feedback. Did you engage when something was unclear about the spec or desired behavior?
• Delighters - Impress us. How did you challenge yourself with this assignment? Did you learn something  new? Did you teach us something?'

Task
Your task is to create a Node.js service written using TypeScript that implements a Central Limit Order Book (CLOB).  It should accept orders via a REST, WebSocket, or GraphQL API and publish updates on order book state changes  or if trades occur. Although Tradeweb is primarily a fixed-income marketplace, we'd like for you to build a CLOB for  trading equities (stocks). They're simpler and odds are you have some familiarity with placing stock orders through a  retail brokerage.
All data should be kept in memory (do not use databases). Your central limit order book should implement the test  cases listed in the appendix below. There you'll also find some finance and trading terms that can help you along your  way. If at any moment, you're unclear of a definition, concept, or how something should work -- ask us!
Bonus: Create a front-end web application that implements a trader user interface (UI)
While completely optional, you may decide to build a simple UI for your CLOB. If you do, it should have the following  screens:
1. A list of Symbols and the associate best bid (or buy order), and best offer (or sell order). 2. An order entry form for creating and modify orders.
3. A list of open, canceled, and completed orders and trades for the current trader (a blotter). Appendix
   What's in a Limit Order Book?
   So, what's a Limit Order Book? On a trading application, a CLOB is an aggregated view of all the open orders in the  system at different price levels. An example limit order book for a single stock looks like this:
   Ticker: TW
   Bids
   Offers
   Qty
   Price
   Price
   Qty
   100
   $99.50
   $99.55
   200
   350
   $99.45
   $99.60
   300
   500
   $99.40
   $99.75
   1,000



Notice how the bids and offers don't overlap in price, and they're price sorted in opposite directions. The best bid and  best offer are often referred to as "top of book". This table reads as there is a buyer of 100 shares at $99.50 and a  seller for 200 shares at $99.55. Each LOB is partitioned by symbol, so orders for TW cannot interact with orders for  AAPL, etc. Also note that the end-user view of bids and offers are anonymous and aggregated by price, so each user  doesn't know how many orders there are and who the traders are, but internally the system knows exactly which  underlying orders make up the bids and offers.
Here are the properties we would expect on objects that make an order book work:
• Ticker - A ticker is typically a 1-4 length character identifier of a stock - For example: TW, F, IBM, AAPL, CSCO,  GOOG
• Trader - A trader is a user of our system and are responsible for buying and selling stocks. o username - the login of the trader
o password - the password of the trader
• Order - An order is an instruction to buy or sell a stock. An order has the following properties: o ticker - the ticker being traded
o trader - the user who created the orderside - can be either 'buy' or 'sell' depending if the trader wants to  buy or sell
o limit - the price at which the stock is being bought or sold
o quantity - the number of desired shares of a stock that is being bought or sold
o filledQuantity - the number of shares that has been traded from this order
o status - the status of the order. Typically, one of 'open', 'canceled', 'completed'
o createdAt - the date and time an order was created
• Trade - A trade occurs when the price from 2 orders from different traders overlap. It has the following  properties:
o ticker - the ticker that was traded
o price - the price of the trade (if prices from Buy and Sell orders overlap, the trade price is at the mid point)
o quantity - how many shares were traded
o buyOrder - the buy order that caused the trade (note: the order identifies the buying trader) o sellOrder - the sell order that caused the trade (note: the order identifies the selling trader) o createdAt - the date and time of the trade
Test Cases
You should demonstrate that you have correctly implemented proper behavior with the following test cases. The  syntax below is based on cucumber.js https://github.com/cucumber/cucumber-js, but feel free to use your preferred  unit testing framework.
Feature: Central Limit Order Book

Scenario: A single valid order is accepted into the limit order book  Given an empty orderbook for "TW"
When the following orders are created:
| ticker | trader | side | limit | quantity |
| TW | trader1 | buy | $99.50 | 100 |
Then the limit orderbook should be:
| ticker | trader | side | limit | quantity | filledQty | status |
| TW | trader1 | buy | $99.50 | 100 | 0 | open |
Scenario: Multiple valid orders are accepted into the limit order book  Given an empty order book for "TW"
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


Team member gitbhub handles
• Stefan Kutko (stefankutko) • Chris Arnesen (carnesen) • Matthias Jenny (m1010j) • Nick Boylan (elsherrif546) • Michael Lazebnik (mlazebnik) • Vaibhav Saharan (vsaharan) • Amr Abdelhady (aabdelha)

