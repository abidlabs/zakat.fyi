// Calculate the price of gold, silver, and nisab dynamically

var gold_price_per_oz_usd = 1723.82
var gold_price_per_oz = 1723.82
var silver_price_per_oz_usd =  15.154
var silver_price_per_oz =  15.154
var nisab_usd = 318.23
var nisab = nisab_usd

$.getJSON("https://data-asg.goldprice.org/dbXRates/USD", function(json){
    gold_price_per_oz_usd = json["items"][0]["xauPrice"]
    silver_price_per_oz_usd = json["items"][0]["xagPrice"]
    nisab_usd = silver_price_per_oz_usd*21

    nisab = nisab_usd
    gold_price_per_oz = gold_price_per_oz_usd
    silver_price_per_oz = silver_price_per_oz_usd

	$('.nisab-price-value').html(nisab.toFixed(2))
	$('.gold-price-value').html(gold_price_per_oz.toFixed(2))
	$('.silver-price-value').html(silver_price_per_oz.toFixed(2))    
});	


// Handle currency conversions (should happen after dynamic loading of prices)

var currencySymbols = {
  "USD": "$",
  "EUR": "&euro;",
  "CAD": "$", 
  "GBP": "£",
  "TRY": "₺"
};

var currencyConversions = {
  "USD": 1.00,
  "EUR": 1.00,
  "CAD": 1.00, 
  "GBP": 1.00,
  "TRY": 1.00
}; // These are updated through JSON requests

$.getJSON("https://api.exchangeratesapi.io/latest?base=USD", function(json){
	for (var curr in currencyConversions){
	    currencyConversions[curr] = json["rates"][curr]
	};	
	$('#currency-select').removeAttr('disabled')
});


// Event handlers

$('#investments-yes').click(function(){
	$('.investments-related').css('display', 'block')
})
$('#investments-no').click(function(){
	$('.investments-related').css('display', 'none')
})

$('#real-estate-yes').click(function(){
	$('.real-estate-related').css('display', 'block')
})
$('#real-estate-no').click(function(){
	$('.real-estate-related').css('display', 'none')
})

$('#business-yes').click(function(){
	$('.business-related').css('display', 'block')
})
$('#business-no').click(function(){
	$('.business-related').css('display', 'none')
})

$('#currency-select').change(function(){
	var symbol = currencySymbols[$(this).val()]
	var conversionRate = currencyConversions[$(this).val()]
	$('.currency-prepend').html(symbol)
	nisab = nisab_usd * conversionRate
	gold_price_per_oz = gold_price_per_oz_usd * conversionRate
	silver_price_per_oz = silver_price_per_oz_usd * conversionRate
	
	$('.nisab-price-value').html(nisab.toFixed(2))
	$('.gold-price-value').html(gold_price_per_oz.toFixed(2))
	$('.silver-price-value').html(silver_price_per_oz.toFixed(2))

	updateMetalTotals()
})

function updateMetalTotals(){
	var goldTotal = Number($('#gold-oz').val()) * gold_price_per_oz + Number($('#gold-value').val())  
	var silverTotal = Number($('#silver-oz').val()) * silver_price_per_oz + Number($('#silver-value').val())  
	$('#gold-total').html(goldTotal.toFixed(2))
	$('#gold-total-hidden').val(goldTotal)	
	$('#silver-total').html(silverTotal.toFixed(2))
	$('#silver-total-hidden').val(silverTotal)	
}

$("#calculate-zakat-button").click(function() {
    $('html, body').animate({
        scrollTop: $("nav").offset().top
    }, 1000);
});

$("form :input").change(function() {
  updateMetalTotals()
  updateProgressBar();
  updateZakatAmount();
});
$('.btn-toolbar').click(function() {
  updateMetalTotals()
  updateProgressBar();
  updateZakatAmount();
})


function updateProgressBar() {
   var num_required_elements = 0
   var num_filled_elements = 0

	$('form *').filter(':input').each(function(){
		gparent = $(this).parent().parent()
		if (gparent.hasClass('required')){
			num_required_elements += 1;
		    if($.trim(this.value).length){
		    	num_filled_elements += 1
		    }			
		}
	});


  var scrolled = num_filled_elements * 100.0 / num_required_elements;
  document.getElementById("myBar").style.width = scrolled + "%";
}

function updateZakatAmount() {
	var zakatAmount = 0
	var totalAssetsMinusLiabilities = 0

	$('form *').filter(':input').each(function(){
		var val = $(this).val()
		var multiplier = $(this).attr('data-multiplier') || 0
		if ($.isNumeric(val)) {
			zakatAmount += parseInt(val) * parseFloat(multiplier);
			if (parseFloat(multiplier) > 0){
				totalAssetsMinusLiabilities += parseInt(val)
			}
			else {
				totalAssetsMinusLiabilities -= parseInt(val)
			}
		}
	});
	console.log('Total Assets Minus Liabilities:', totalAssetsMinusLiabilities)
	console.log('Total Zakat:', zakatAmount)
	
	if (totalAssetsMinusLiabilities < nisab){
		zakatAmount = '0.00'
		$('.below-nisab').css('display', 'inline') 
	} else {
		zakatAmount = zakatAmount.toFixed(2)
		$('.below-nisab').css('display', 'none') 
	}
	$('.zakat-amount').html(zakatAmount) 
}

