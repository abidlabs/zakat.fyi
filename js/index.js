const nisab = 4560.33

function calculateZakah(){
	// load options that determine which opinion is being followed
	// call submethod for relevant sub-opinion	
}

// When any element of the form changes
$("form :input").change(function() {
  updateProgressBar();
  updateZakatAmount();
});
$('.btn-group').click(function() {
  updateProgressBar();
  updateZakatAmount();
})


// When the user scrolls the page, execute myFunction
function updateProgressBar() {
   var num_required_elements = 0
   var num_filled_elements = 0

	$('form *').filter(':input').each(function(){
		gparent = $(this).parent().parent()
		if (gparent.hasClass('required')){
			num_required_elements += 1;
		    if($.trim(this.value).length){
		    	num_filled_elements += 1
		    }			
		}
	});

	console.log(num_required_elements)
	console.log(num_filled_elements)

  var scrolled = num_filled_elements * 100.0 / num_required_elements;
  document.getElementById("myBar").style.width = scrolled + "%";
}

// When the user scrolls the page, execute myFunction
function updateZakatAmount() {
	var zakatAmount = 0

	$('form *').filter(':input').each(function(){
		var val = $(this).val()
		var multiplier = $(this).attr('data-multiplier') || 0
		if ($.isNumeric(val)) {
			zakatAmount += parseInt(val) * parseFloat(multiplier);
		}
	});
	if (zakatAmount < nisab){
		zakatAmount = '0.00'
		$('#zakat-preview').css('display', 'inline') 
	} else {
		zakatAmount = zakatAmount.toFixed(2)
		$('#zakat-preview').css('display', 'none') 
	}
	$('.zakat-amount').html(zakatAmount) 
}


$('#agriculture-yes').click(function(){
	$('.agricultral-text-field').addClass('required')
	$('.agricultral-text-field').removeClass('hidden')	
	$('#agriculture-natural-irrigation-field').attr('data-multiplier', '0.10')
	$('#agriculture-manual-irrigation-field').attr('data-multiplier', '0.05')
})
$('#agriculture-no').click(function(){
	$('.agricultral-text-field').addClass('hidden')
	$('.agricultral-text-field').removeClass('required')	
	$('#agriculture-natural-irrigation-field').attr('data-multiplier', '0.00')
	$('#agriculture-manual-irrigation-field').attr('data-multiplier', '0.00')
})