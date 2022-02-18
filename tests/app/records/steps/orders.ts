import { Given, Then, When } from "@cucumber/cucumber";

export default function() {

  Given(/^an empty orderbook for {ticker}$/, function(ticker) {
    console.log(ticker);
  });

  When(/^the following orders are created:$/, function(callback) {
    callback.pending();
  });

  Then(/^the limit orderbook should be$/, function(callback) {
    callback.pending();
  });

  Then(/^I can access that item from the grocery list$/, function(callback) {
    callback.pending();
  });

}
Given(/^an empty orderbook for "([^"]*)"$/, function() {

})
Then(/^the limit orderbook should be:$/, function() {

})
Given(/^an empty order book for "([^"]*)"$/, function() {

})
Then(/^the limit order book should be:$/, function() {

})
Then(/^the following trades are created:$/, function() {

})
