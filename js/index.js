import * as functions from "./functions.js";
import * as prices from "./prices.js";
import * as currency from "./currency.js";

// honestly, everything is going to touch nisab, so let's leave it to be global.
window.nisab = prices.nisab_usd

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

  $("#calculate-zakat-button").click(function() {
      $('html, body').animate({
          scrollTop: $("nav").offset().top
      }, 1000);
  });

  $("form :input").change(functions.updatePage);
  $('.btn-toolbar').click(functions.updatePage);
});
