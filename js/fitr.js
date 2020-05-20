function getClosestMosques(zipcode){
	// Hardcoded: TODO(Ihssan): replace this with query result
	var query_result = [{
		'name': 'ISBCC',
		'distance': 7.3244,
		'address': '40 Royal Oak Ct, Boston, MA 02139',
		'amount': 12,
		'url': 'www.google.com'
	}, {
		'name': 'ISB',
		'distance': 17.3244,
		'address': '300 Memorial Drive, Cambridge, MA 01238',
		'amount': 10,	
		'url': 'www.google.com'
	}, {
		'name': 'Masjid Noor',
		'distance': 27.3244,
		'address': '1234 Looney Toon Lane, Beaumont TX, 12345',
		'amount': 10,
		'url': 'www.google.com'
	}]
	return query_result	
}


$('#go-button').click(function() {
  var zipcode = $('#input-zipcode').val()
  var query_result = getClosestMosques(zipcode)

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
	    return 'Zakat-al-fitr: $' + query_result[index]['amount']
	});
	$(".masjid-link").attr('href', function(index) {
	    return query_result[index]['url']
	});

	$('#fitr-amount').html(query_result[0]['amount'])
	$('#masjid-box').show()


  $('html, body').animate({
      scrollTop: $("#masjid-box").offset().top
  }, 1000);	
})
