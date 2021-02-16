import * as currency from "./currency.js";
import * as functions from "./functions.js";

// Calculate the price of gold, silver, and nisab dynamically
export var nisab_usd = 580.18
export var gold_price_per_oz_usd = 1820.84 
export var gold_price_per_oz = 1820.84 
export var silver_price_per_oz_usd =  27.63 
export var silver_price_per_oz =  27.63 
export var conversionRate = 1.00

// Handle currency conversions (should happen after dynamic loading of prices)
$.getJSON("https://data-asg.goldprice.org/dbXRates/USD", function(json){
  gold_price_per_oz_usd = json["items"][0]["xauPrice"]
  silver_price_per_oz_usd = json["items"][0]["xagPrice"]
  nisab_usd = silver_price_per_oz_usd*21

  window.nisab = nisab_usd
  gold_price_per_oz = gold_price_per_oz_usd
  silver_price_per_oz = silver_price_per_oz_usd

	$('.nisab-price-value').html(nisab.toFixed(2))
	$('.gold-price-value').html(gold_price_per_oz.toFixed(2))
	$('.silver-price-value').html(silver_price_per_oz.toFixed(2))    
  $('.price-last-updated').html("today") // last updated = today

  $('#currency-select').trigger('change')  
}).fail(function(){
  console.log("Using cached prices of gold and silver")
}

);	

$('#currency-select').change(function(){
  var symbol = currency.currencySymbols[$(this).val()]
  conversionRate = currency.currencyConversions[$(this).val()]
  $('.currency-prepend').html(symbol)
  window.nisab = nisab_usd * conversionRate
  gold_price_per_oz = gold_price_per_oz_usd * conversionRate
  silver_price_per_oz = silver_price_per_oz_usd * conversionRate
  
  $('.nisab-price-value').html(nisab.toFixed(2))
  $('.gold-price-value').html(gold_price_per_oz.toFixed(2))
  $('.silver-price-value').html(silver_price_per_oz.toFixed(2))

  functions.updateMetalTotals();
});
