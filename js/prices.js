// Calculate the price of gold, silver, and nisab dynamically
export var nisab_usd = 318.23
export var gold_price_per_oz_usd = 1723.82
export var gold_price_per_oz = 1723.82
export var silver_price_per_oz_usd =  15.154
export var silver_price_per_oz =  15.154

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
});	
