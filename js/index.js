import * as functions from "./functions.js";
import * as prices from "./prices.js";
import * as currency from "./currency.js";
import * as db from "./db.js";
import * as cookies from "./cookies.js";
import * as form from "./form.js";

// honestly, everything is going to touch nisab, so let's leave it to be global.
window.nisab = prices.nisab_usd

// wait for document ready
$(function() {
  /* *******************************************
  ******** SECTION: Intialization **************
  ******************************************** */
  var user_count = db.getNumUsers();
  var uid = cookies.getCookie("uid");
  if (uid==null) {
    // initialize a UID
    cookies.initializeIdentity();
  } else {
    // restore a previous session 
		var data = JSON.parse(localStorage.getItem("data"));	
	  form.restoreForm(data);	
    functions.updatePage();
  }

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

  $('#metals-yes').click(function(){
    $('.metals-related').css('display', 'block')
  })
  $('#metals-no').click(function(){
    $('.metals-related').css('display', 'none')
  })

  $('#accounts-yes').click(function(){
    $('.accounts-related').css('display', 'block')
  })
  $('#accounts-no').click(function(){
    $('.accounts-related').css('display', 'none')
  })


  $("#calculate-zakat-button").click(function() {
      $('html, body').animate({
          scrollTop: $("nav").offset().top
      }, 1000);
  });

  $("#calculate-zakat-button-end").click(function(){
  	$('#calculate-zakat-button-end').css('display', 'none')
  	$('#ending-messages').css('display', 'block')
  })

  $("#form :input").change(db.sendToDB);
  $("form :input").change(functions.updatePage);
  $('.btn-group').click(functions.updatePage);

	$('.congrats-message-container').on("show", function() {
    db.sendToDB(form);
	});
  $('.btn-toolbar').click(functions.updatePage);

	// When the user scrolls the page, execute myFunction
	window.onscroll = functions.updateProgressBar

});
