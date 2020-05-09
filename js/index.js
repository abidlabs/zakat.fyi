import * as functions from "./functions.js";
import * as prices from "./prices.js";
import * as currency from "./currency.js";
import * as db from "./db.js";
import * as cookies from "./cookies.js";
import * as form from "./form.js";

// honestly, everything is going to touch nisab, so let's leave it to be global.
window.nisab = prices.nisab_usd

// wait for document ready
$(async function() {
  /* *******************************************
  ******** SECTION: Intialization **************
  ******************************************** */

  // load the number of users into the page
  var user_count = await db.getNumUsers();
  $(".num-people-count").html(user_count);
  $('.num-people-count').each(function () {
    var $this = $(this);
    jQuery({ Counter: 0 }).animate({ Counter: $this.text() }, {
      duration: 1000,
      easing: 'swing',
      step: function () {
        $this.text(Math.ceil(this.Counter));
      }
    });
  });


  // get user cookies
  var uid = cookies.getCookie("uid");
  if (uid==null) {
    // initialize a UID
    cookies.initializeIdentity();
  } else {
    // restore a previous session 
		var data = JSON.parse(localStorage.getItem("data"));	
	  form.restoreForm(data, function() {
      functions.updatePage();
      functions.loadRelatedDivs();
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


  /// SET UP RELATED-DIVS EVENT HANDLERS
  $('.related-hidden .show-link').click(function() {
    var category = $(this).parent().attr('category')
    $('.related-hidden[category=' + category + ']').hide()  // the related hid div
    $('.related-show[category=' + category + ']').show() // the related show div
    $('.btn-turbo[category=' + category + ']').addClass('active')
    $('input[category=' + category + ']').prop("checked", true);
  })

  $('.btn-turbo').click(function() {
    var category = $(this).attr('category')
    if ($(this).hasClass('active')){
      $('.related-hidden[category=' + category + ']').show()  // the related hid div
      $('.related-show[category=' + category + ']').hide() // the related show div      
      $('.related-show[category=' + category + '] input').val(0) // the related show div      
    } else {
      $('.related-hidden[category=' + category + ']').hide()  // the related hid div
      $('.related-show[category=' + category + ']').show() // the related show div
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
