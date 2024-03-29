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
  const elements = ["illiquid", "debt", "investments", "real-estate", "metals", "accounts", "business", "fines"]  
  // var turbo_buttons = [$("#checkbox-illiquid"), $("#checkbox-debt"), $("#checkbox-investments"), $("#checkbox-real-estate"), $("#checkbox-metals"), $("#checkbox-accounts"), $("#checkbox-business"), $("#checkbox-fines")] 
  // var turbo_related = [$(".illiquid-related"), $(".debt-related"), $(".investments-related"), $(".real-estate-related"), $(".metals-related"), $(".accounts-related"), $(".business-related"), $(".fines-related")]
  for (var i = 0; i < elements.length; i++) {
    var checkbox = $("#checkbox-" + elements[i])
    if (checkbox.prop("checked") == true) {
      $("."+elements[i]+"-related").css('display', 'block') 
      $("."+elements[i]+"-hidden").css('display', 'none') 
    }
    else {
      $("."+elements[i]+"-related").css('display', 'none') 
      $("."+elements[i]+"-hidden").css('display', 'block') 
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
	        var totalAssets = parseFloat(row.find('input[class*="stock-assets"]').val().replace(/\,/g, '')) || 0;
	        var sharesOutstanding = parseFloat(row.find('input[class*="stock-total-shares"]').val().replace(/\,/g, '')) || 0;
	        var sharesOwned = parseFloat(row.find('input[class*="stock-your-shares"]').val().replace(/\,/g, '')) || 0;
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
}

export function updateZakatAmount() {
	var zakatAmount = 0
	var totalAssetsMinusLiabilities = 0

	$('form *').filter(':input').each(function(){
		var val = $(this).val().replace(/\,/g, '') || 0
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
		zakatAmount = Math.round(zakatAmount * 100) / 100
		zakatAmount = zakatAmount.toLocaleString()
		$('.below-nisab').css('display', 'none') 
	}
	totalAssetsMinusLiabilities = Math.round(totalAssetsMinusLiabilities * 100) / 100
	totalAssetsMinusLiabilities = totalAssetsMinusLiabilities.toLocaleString()	
	$('.zakat-liable-amount').html(totalAssetsMinusLiabilities)
	$('.zakat-amount').html(zakatAmount) 
}
