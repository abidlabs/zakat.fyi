// Calculate the price of gold, silver, and nisab dynamically

var gold_price_per_oz_usd = 1723.82
var gold_price_per_oz = 1723.82
var silver_price_per_oz_usd =  15.154
var silver_price_per_oz =  15.154
var nisab_usd = 318.23
var nisab = nisab_usd

$.getJSON("https://fcsapi.com/api-v2/forex/latest?id=1984&access_key=JgLJmYW6dLtMgVDJ5xZ88MPyTBjqTznjjJFTBrnQte9FC3zqc1", function(json){
    gold_price_per_oz_usd = json["response"][0]["price"]
});	

$.getJSON("https://fcsapi.com/api-v2/forex/latest?id=1975&access_key=JgLJmYW6dLtMgVDJ5xZ88MPyTBjqTznjjJFTBrnQte9FC3zqc1", function(json){
    silver_price_per_oz_usd = json["response"][0]["price"]
    nisab_usd = silver_price_per_oz_usd*21
});	


// Handle currency conversions (should happen after dynamic loading of prices)

var currencySymbols = {
  "USD": "$",
  "EUR": "&euro;",
  "CAD": "$", 
};

var currencyConversions = {
  "USD": 1.00,
  "EUR": 1.00,
  "CAD": 1.00, 
}; // These are updated through JSON requests

var numCurrenciesLoaded = 0
for (var curr in currencyConversions){
	$.getJSON("https://api.exchangeratesapi.io/latest?base=USD&symbols=" + curr, function(json){
	    currencyConversions[curr] = json["rates"][curr]
	    numCurrenciesLoaded += 1
	    if (numCurrenciesLoaded == Object.keys(currencyConversions).length) { // Hackish way to confirm that all of the conversions have loaded
	    	$('#currency-select').removeAttr('disabled')
	    }
	});	
}


// Event handlers

$('#currency-select').change(function(){
	var symbol = currencySymbols[$(this).val()]
	var conversionRate = currencyConversions[$(this).val()]
	$('.currency-prepend').html(symbol)
	nisab = nisab_usd * conversionRate
	gold_price_per_oz = gold_price_per_oz_usd * conversionRate
	silver_price_per_oz = silver_price_per_oz_usd * conversionRate
})


$("#calculate-zakat-button").click(function() {
    $('html, body').animate({
        scrollTop: $("nav").offset().top
    }, 1000);
});

$("form :input").change(function() {
  updateProgressBar();
  updateZakatAmount();
});
$('.btn-group').click(function() {
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
	if (totalAssetsMinusLiabilities < nisab){
		zakatAmount = '0.00'
		$('.below-nisab').css('display', 'inline') 
	} else {
		zakatAmount = zakatAmount.toFixed(2)
		$('.below-nisab').css('display', 'none') 
	}
	$('.zakat-amount').html(zakatAmount) 
}

