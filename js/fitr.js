var zipcodes_closest_mosques;

// global Google analytics objects
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-166050306-1');

function getClosestMosques(zipcode){
	// Hardcoded: TODO(Ihssan): replace this with query result
	return zipcodes_closest_mosques[zipcode]
}

function getQueryStringMap() {
    var QueryString = function() {
        // This function is anonymous, is executed immediately and 
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);

        if (query.charAt(query.length - 1) == '/') {
          query = query.substr(0, query.length - 1);
        }

        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    }();
    return QueryString;
}

function updateUrl(zip) {
    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?zip=' + encodeURIComponent(zip);
        window.history.pushState({
            path: newurl
        }, '', newurl);
    }
}

function showMasjidsByZip(zipcode, recordEvent) {
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

		if (recordEvent) {
			updateUrl(zipcode);
			gtag('event', 'go-button-clicked-valid-zipcode', {'zipcode': zipcode})
		}

  	} else {
  		$('.error-message').show();
  		if (recordEvent) {
  			gtag('event', 'go-button-clicked-invalid-zipcode', {'zipcode': zipcode})
  		}
  	}
}

$(function() {
	$.getJSON("data/fitr/zipcodes_to_closest_mosques.json", function(json) {
	    zipcodes_closest_mosques = json; // this will show the info it in firebug console

	    // Check if zip query param exists
	    var queryParams = getQueryStringMap();
		if (queryParams["zip"]) {
			$('#input-zipcode').val(queryParams["zip"]);
			showMasjidsByZip(queryParams["zip"]);
		}
	});

	$('#go-button').click(function() {
		var zipcode = $('#input-zipcode').val();
		showMasjidsByZip(zipcode, true);
	});

	$("#input-zipcode").on('keyup', function (e) {
	    if (e.keyCode === 13) {
	        var zipcode = $('#input-zipcode').val();
			showMasjidsByZip(zipcode, true);
	    }
	});
});
