export var currencySymbols = {
  "USD": "$",
  "EUR": "&euro;",
  "CAD": "$", 
  "GBP": "£",
  "TRY": "₺",
  "INR": "₹",
  "PKR": "&#8360"
};

export var currencyConversions = {
  "USD": 1.00,
  "EUR": 1.00,
  "CAD": 1.00, 
  "GBP": 1.00,
  "TRY": 1.00,
  "INR": 1.00,
  "PKR": 1.00
}; // These are updated through JSON requests


$.getJSON("https://api.exchangeratesapi.io/latest?base=USD&access_key=4b0fb6730ea893a5552705571f94504a", function(json){
  for (var curr in currencyConversions){
      currencyConversions[curr] = json["rates"][curr]
      // Add a manaul conversion rate for PKR for now
      if (curr === "PKR") {
        currencyConversions[curr] = 159.36;
        console.log("Using cached value of Pakistani rupee set at 15 Feb 2021")
      }

  };  
        
	$('#currency-select').removeAttr('disabled')
  $('#currency-select').trigger('change')

}).fail(function(){
  console.log("Error: couldn't load currency data.")
});
