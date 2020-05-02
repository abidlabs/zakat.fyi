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

  $('#coffee-image').click(function(){
    $('#donate').css('display', 'block')
    $('.navbar').css('visibility', 'hidden')
    $('.progress-container').css('visibility', 'hidden')    
  })

  $('#close-modal').click(function(){
    $('#donate').css('display', 'none')
    $('.navbar').css('visibility', 'visible')
    $('.progress-container').css('visibility', 'visible')    
  })

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

  	$('#emailModal').modal('show');
    // Populate email form with previously entered email, if not use whatever they enter here to send to our db
    $('.email-receipt-confirm').val($('#email-field').val());
  });

  $('#savereceipt').click(function() {
        var email = $('#email-recapture').val();
        var subject = 'Your 2020 Zakat.fyi Receipt';
        var emailBody = 'Salaam!%0D%0A%0D%0AThank you for using Zakat.fyi to calculate your true zakat for 2020.%0D%0A%0D%0AYour Zakat amount is: ' + $('.currency-prepend').html()+$('.zakat-amount').html() + '%0D%0A%0D%0ASalaam,%0D%0AZakat.fyi team';
        document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
  })

  $('#emailModal').on('hidden.bs.modal', function(e) {
    $('#form').hide();
    $('#hero').hide()
    $('#ending-messages').show();
    $('#charity-carousel').css('display', 'block')
    window.scrollTo(0, 0);
  });

  $("#form :input").change(db.sendToDB);
  $("form :input").change(functions.updatePage);
  $('.btn-group').click(functions.updatePage);

	$('.congrats-message-container').on("show", function() {
    db.sendToDB(form);
	});
  $('.btn-toolbar').click(functions.updatePage);

	// When the user scrolls the page, execute myFunction
	window.onscroll = functions.updateProgressBar

  $("#financials-table").on("change", "input", function(event){  // Explicitly reincluded to include bindings.
      functions.updateFinancialsTable();
  });


});
