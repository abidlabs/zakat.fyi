var zipcodes_closest_mosques;

// global Google analytics objects
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-166050306-1');


$.getJSON("data/fitr/zipcodes_to_closest_mosques.json", function(json) {
    zipcodes_closest_mosques = json; // this will show the info it in firebug console
});

function getClosestMosques(zipcode){
	// Hardcoded: TODO(Ihssan): replace this with query result
	return zipcodes_closest_mosques[zipcode]
}


$('#go-button').click(function() {
  var zipcode = $('#input-zipcode').val()
  var query_result = getClosestMosques(zipcode)
   gtag('event', 'go-button-clicked')

  	if (typeof query_result !== 'undefined') {

		$(".masjid-name").html(function(index) {
		    return (index + 1) + '. ' + query_result[index]['name']
		});
		$(".masjid-address").html(function(index) {
		    return query_result[index]['address']
		});
		$(".masjid-distance").html(function(index) {
		    return Math.round(query_result[index]['distance']) + ' miles away'
		});
		$(".masjid-link").html(function(index) {
		    return 'Zakat-al-fitr: ' + query_result[index]['amount']
		});
		$(".masjid-link").attr('href', function(index) {
		    return query_result[index]['url']
		});

		$('#fitr-amount').html(query_result[0]['amount'])
		$('#masjid-box').show()
		$('#masjid-placeholder').hide()
		$('.error-message').hide()

		  $('html, body').animate({
		      scrollTop: $("#masjid-box").offset().top
		  }, 1000);	
    	gtag('event', 'go-button-clicked-valid-zipcode', {'zipcode': zipcode})

  	} else {
  		$('.error-message').show()
    	gtag('event', 'go-button-clicked-invalid-zipcode', {'zipcode': zipcode})

  	}

})
