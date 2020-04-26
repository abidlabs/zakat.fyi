import * as prices from "./prices.js";

export function updatePage() {
  updateProgressBar();
  updateZakatAmount();
  updateMetalTotals()
}

export function updateMetalTotals() {
	var goldTotal = Number($('#gold-oz').val()) * prices.gold_price_per_oz + Number($('#gold-value').val())  
	var silverTotal = Number($('#silver-oz').val()) * prices.silver_price_per_oz + Number($('#silver-value').val())  
	$('#gold-total').html(goldTotal.toFixed(2))
	$('#silver-total').html(silverTotal.toFixed(2))	
}

export function updateProgressBar() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop - 587;
  if (winScroll < 0) {
  	winScroll = 0;
  }
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight - 587 - 300;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("myBar").style.width = scrolled + "%";
 //   var num_required_elements = 0
 //   var num_filled_elements = 0
	// $('form *').filter(':input').each(function(){
	// 	var gparent = $(this).parent().parent();
	// 	if (gparent.hasClass('required')){
	// 		num_required_elements += 1;
	// 	    if($.trim(this.value).length){
	// 	    	num_filled_elements += 1
	// 	    }			
	// 	}
	// });

 //  var scrolled = num_filled_elements * 100.0 / num_required_elements;
 //  document.getElementById("myBar").style.width = scrolled + "%";
}

export function updateZakatAmount() {
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
