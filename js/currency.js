export var currencySymbols = {
  "USD": "$",
  "EUR": "&euro;",
  "CAD": "$", 
  "GBP": "£",
  "TRY": "₺"
};

export var currencyConversions = {
  "USD": 1.00,
  "EUR": 1.00,
  "CAD": 1.00, 
  "GBP": 1.00,
  "TRY": 1.00
}; // These are updated through JSON requests

$.getJSON("https://api.exchangeratesapi.io/latest?base=USD", function(json){
	for (var curr in currencyConversions){
	    currencyConversions[curr] = json["rates"][curr]
	};	
	$('#currency-select').removeAttr('disabled')
});
