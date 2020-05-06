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
    var table = document.getElementById("financials-table");
    var financialsTotalZakat = 0;
    for (var i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
        var stockName = row.cells[0];
        var totalAssets = row.cells[1];
        var sharesOutstanding = row.cells[2];
        var sharesOwned = row.cells[3];

        var zakatAmount = Math.round(totalAssets * (sharesOutstanding * 100.0) / sharesOwned) / 100;
        financialsTotalZakat += zakatAmount; 
    }

    $('#financials-total-hidden').val(financialsTotalZakat);
	$('#financials-total').val(financialsTotalZakat);
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
		var val = $(this).val().replace(',', '')
		var multiplier = $(this).attr('data-multiplier') || 0
		if ($.isNumeric(val)) {
			zakatAmount += parseFloat(val) * parseFloat(multiplier);
			if ($(this).hasClass('asset')){
				totalAssetsMinusLiabilities += parseFloat(val)
			}
			else if ($(this).hasClass('liability')) {
				totalAssetsMinusLiabilities -= parseFloat(val)
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
	$('.zakat-liable-amount').html(totalAssetsMinusLiabilities.toFixed(2))
	$('.zakat-amount').html(zakatAmount) 
}
