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
	  form.restoreForm(data, function() {
      functions.loadRelatedDivs();
      functions.updatePage();
      // functions.loadRelatedDivs();
    });	
  }

  /* *******************************************
  *********** SECTION: Event Handlers **********
  ******************************************** */

  $('.support-button').click(function(){
    $('#donate').css('display', 'block')
    $('.navbar').css('visibility', 'hidden')
    $('.progress-container').css('visibility', 'hidden')  
    return false;  
  })

  $('#close-modal').click(function(){
    $('#donate').css('display', 'none')
    $('.navbar').css('visibility', 'visible')
    $('.progress-container').css('visibility', 'visible')    
  })

  $("#btn-real-estate").click(function(){
    if ($(this).hasClass('active')){
      $('.real-estate-related').css('display', 'none')
      $('.real-estate-related input').val(0)      
    } else {
      $('.real-estate-related').css('display', 'block')
    }
  })

  $("#btn-investments").click(function(){
    if ($(this).hasClass('active')){
      $('.investments-related').css('display', 'none')
      $('.investments-related input').val(0)      
    } else {
      $('.investments-related').css('display', 'block')
    }
  })


  $("#btn-business").click(function(){
    if ($(this).hasClass('active')){
      $('.business-related').css('display', 'none')
      $('.business-related input').val(0)      
    } else {
      $('.business-related').css('display', 'block')
    }
  })



  $("#btn-metals").click(function(){
    if ($(this).hasClass('active')){
      $('.metals-related').css('display', 'none')
      $('.metals-related input').val(0)      
    } else {
      $('.metals-related').css('display', 'block')
    }
  })

  $("#btn-accounts").click(function(){
    if ($(this).hasClass('active')){
      $('.accounts-related').css('display', 'none')
      $('.accounts-related input').val(0)      
    } else {
      $('.accounts-related').css('display', 'block')
    }
  })

  $("#btn-illiquid").click(function(){
    if ($(this).hasClass('active')){
      $('.illiquid-related').css('display', 'none')
      $('.illiquid-related input').val(0)      
    } else {
      $('.illiquid-related').css('display', 'block')
    }
  })

  $("#btn-fines").click(function(){
    if ($(this).hasClass('active')){
      $('.fines-related').css('display', 'none')
      $('.fines-related input').val(0)      
    } else {
      $('.fines-related').css('display', 'block')
    }
  })

    $("#btn-debt").click(function(){
    if ($(this).hasClass('active')){
      $('.debt-related').css('display', 'none')
      $('.debt-related input').val(0)      
    } else {
      $('.debt-related').css('display', 'block')
    }
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
        window.open("mailto:"+email+"?subject="+subject+"&body="+emailBody);
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

  var numbered_item = 0;
  $('body').find('.numbered-item').each(function () {
    numbered_item += 1;
    $(this).html(numbered_item + '.');
  });

  // show the related sections if the button was pressed
});
