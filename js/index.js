var nisab = 4560.33 // TODO(Iqra): calculate this dynamically based on value of silver

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


$('#currency-select').change(function(){
	var symbol = currencySymbols[$(this).val()]
	$('.currency-prepend').html(symbol)
	nisab *=  currencyConversions[symbol]
})


function calculateZakah(){
	// load options that determine which opinion is being followed
	// call submethod for relevant sub-opinion	
}

$("#calculate-zakat-button").click(function() {
    $('html, body').animate({
        scrollTop: $("nav").offset().top
    }, 1000);
});


// When any element of the form changes
$("form :input").change(function() {
  updateProgressBar();
  updateZakatAmount();
});
$('.btn-group').click(function() {
  updateProgressBar();
  updateZakatAmount();
})


// When the user scrolls the page, execute myFunction
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

// When the user scrolls the page, execute myFunction
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


$('#agriculture-yes').click(function(){
	$('.agricultral-text-field').addClass('required')
	$('.agricultral-text-field').removeClass('hidden')	
	$('#agriculture-natural-irrigation-field').attr('data-multiplier', '0.10')
	$('#agriculture-manual-irrigation-field').attr('data-multiplier', '0.05')
})
$('#agriculture-no').click(function(){
	$('.agricultral-text-field').addClass('hidden')
	$('.agricultral-text-field').removeClass('required')	
	$('#agriculture-natural-irrigation-field').attr('data-multiplier', '0.00')
	$('#agriculture-manual-irrigation-field').attr('data-multiplier', '0.00')
})