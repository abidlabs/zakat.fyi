var data = [];
var count = 0;

function loadData(data_urls){
	for (var i = 0; i < data_urls.length; i++){
		var data_url = data_urls[i];
		for (var i = 0; i < 10000; i++){
			var a;
		}
		$.ajax({
		  type: "GET",  
		  url: data_url,
		  dataType: "text",       
		  success: function(response)  
		  {
			data = data.concat($.csv.toArrays(response));
			count = data.length;
			setCount();
			setUrl();		
		  }   
		});

	}
}

function setCount(){
	$('#card-count').html(count)
}

function setUrl(){
	seed = Math.floor(Math.random() * (count + 1));
	$('#see-card-button').attr("href", 'card.html?seed=' + seed)
}


var data_urls = [
	"https://abidlabs.github.io/infinite-taboo/out_data/data1.csv",
	// "https://abidlabs.github.io/infinite-taboo/out_data/data2.csv",
	// "https://abidlabs.github.io/infinite-taboo/out_data/data3.csv",
	// "https://abidlabs.github.io/infinite-taboo/out_data/data4.csv",
	// "https://abidlabs.github.io/infinite-taboo/out_data/data-user-submitted.csv",
]
loadData(data_urls);
