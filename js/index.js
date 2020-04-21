function calculateZakah(){
	// load options that determine which opinion is being followed
	// call submethod for relevant sub-opinion	
}

// When any element of the form changes
$("form :input").change(function() {
  updateProgressBar();
  updateZakatAmount();
});



// When the user scrolls the page, execute myFunction
function updateProgressBar() {
   var num_elements = 0
   var num_filled_elements = 0

	$('form *').filter(':input').each(function(){
		num_elements += 1;
	    if($.trim(this.value).length){
	    	num_filled_elements += 1
	    }
	});

  var scrolled = num_filled_elements * 100.0 / num_elements;
  document.getElementById("myBar").style.width = scrolled + "%";
}

// When the user scrolls the page, execute myFunction
function updateZakatAmount() {
	var zakatAmount = 0

	$('form *').filter(':input').each(function(){
		var val = $(this).val()
		if ($.isNumeric(val)) {
			zakatAmount += parseInt(val);
		}
	});
	zakatAmount *= 0.025;
	zakatAmount = zakatAmount.toFixed(2)
	$('.zakat-amount').html(zakatAmount) 
}
