import * as cookies from "./cookies.js";
import * as form from "./form.js";

// get browser ID, IP, etc
var info = {};
function getBrowserData() {
  // If your site is on CloudFlare, then you can use '/cdn-cgi/trace' instead
  $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
    data = data.split('\n');
    $.each(data, function(i) {
      i = i.split("=");
      var key = i[0];
      var value = i[1];
      info[key] = value;
    });
  });
  return 
}

var db = firebase.firestore();

function sendToDB() {
  var uid = getCookie("uid");
  var finishedForm = document.getElementById("form"); 
  var form_json = form.formToJSON(finishedForm.elements);
  db.collection("web_data").add({
    "uid": uid,
    "browser_info": info,
    "form": form_json
  }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
        console.error("Error adding document: ", error);
  });
}
