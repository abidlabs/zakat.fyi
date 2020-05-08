import * as prices from "./prices.js";

// this manages an onshow event
// makes it easy to add stuff to the db
// source: https://www.viralpatel.net/jquery-trigger-custom-event-show-hide-element/
(function ($) {
	$.each(['show', 'hide'], function (i, ev) {
		var el = $.fn[ev];
		$.fn[ev] = function () {
			this.trigger(ev);
			return el.apply(this, arguments);
		};
	});
})(jQuery);

export function updatePage() {
    updateProgressBar();
    updateZakatAmount();
    updateMetalTotals();
    updateFinancialsTable();
}

export function loadRelatedDivs() {
  var turbo_buttons = [$("#btn-illiquid"), $("#btn-debt"), $("#btn-investments"), $("#btn-real-estate"), $("#btn-metals"), $("#btn-accounts"), $("#btn-business"), $("#btn-fines")] 
  var turbo_related = [$(".illiquid-related"), $(".debt-related"), $(".investments-related"), $(".real-estate-related"), $(".metals-related"), $(".accounts-related"), $(".business-related"), $(".fines-related")]
  for (var i = 1; i < turbo_buttons.length; i++) {
    var btn = turbo_buttons[i]
    if (btn.hasClass('active')) {
      turbo_related[i].css('display', 'block')      
    }
  }	
}

export function updateMetalTotals() {
	var goldTotal = Number($('#gold-oz').val()) * prices.gold_price_per_oz + Number($('#gold-value').val())  
	var silverTotal = Number($('#silver-oz').val()) * prices.silver_price_per_oz + Number($('#silver-value').val())  
	$('#gold-total').html(goldTotal.toFixed(2))
	$('#gold-total-hidden').val(goldTotal)
	$('#silver-total').html(silverTotal.toFixed(2))	
	$('#silver-total-hidden').val(silverTotal)
	updateZakatAmount();
}

export function updateFinancialsTable() {
	var financialsTotalAssets = 0;
	$('#financials-table tr').each(function (i, row) {
		if (i > 0) { // ignore <th>
			var row = $(row);
            var stockName = row.find('input[class*="stock-name"]').val();
	        var totalAssets = parseFloat(row.find('input[class*="stock-assets"]').val()) || 0;
	        var sharesOutstanding = parseFloat(row.find('input[class*="stock-total-shares"]').val()) || 0;
	        var sharesOwned = parseFloat(row.find('input[class*="stock-your-shares"]').val()) || 0;
		}
		if (sharesOutstanding > 0 ) {
			financialsTotalAssets += sharesOwned / sharesOutstanding * totalAssets;
		}
	})
	$('#financials-total-hidden').val(financialsTotalAssets);
	$('#financials-total').html(financialsTotalAssets.toFixed(2));
  updateZakatAmount();
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
		var val = $(this).val().replace(',', '') || 0
		var multiplier = $(this).attr('data-multiplier') || 0
		try {
			zakatAmount += eval(val) * parseFloat(multiplier);
			if ($(this).hasClass('asset')){
				totalAssetsMinusLiabilities += eval(val)
			}
			else if ($(this).hasClass('liability')) {
				totalAssetsMinusLiabilities -= eval(val)
			}
		}
		catch(SyntaxError) {
			// pass
		}
	});
	if (totalAssetsMinusLiabilities < nisab){
		zakatAmount = '0.00'
		$('.below-nisab').css('display', 'inline') 
	} else {
		zakatAmount = zakatAmount.toFixed(2)
		$('.below-nisab').css('display', 'none') 
	}
	$('.zakat-liable-amount').html(totalAssetsMinusLiabilities.toFixed(2))
	$('.zakat-amount').html(zakatAmount) 
}
