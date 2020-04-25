import * as functions from "./functions.js";
import * as prices from "./prices.js";
import * as currency from "./currency.js";

// honestly, everything is going to touch nisab, so let's leave it to be global.
window.nisab = currency.nisab_usd

// wait for document ready
$(function() {
  /* *******************************************
  *********** SECTION: Event Handlers **********
  ******************************************** */

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
    window.nisab = nisab_usd * conversionRate
    currency.gold_price_per_oz = prices.gold_price_per_oz_usd * conversionRate
    currency.silver_price_per_oz = prices.silver_price_per_oz_usd * conversionRate
    
    $('.nisab-price-value').html(nisab.toFixed(2))
    $('.gold-price-value').html(gold_price_per_oz.toFixed(2))
    $('.silver-price-value').html(silver_price_per_oz.toFixed(2))

    functions.updateMetalTotals();
  })

  $("#calculate-zakat-button").click(function() {
      $('html, body').animate({
          scrollTop: $("nav").offset().top
      }, 1000);
  });

  $("form :input").change(functions.updatePage);
  $('.btn-group').click(functions.updatePage);
});
