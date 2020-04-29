import * as cookies from "./cookies.js";
import * as form from "./form.js";

// get browser ID, IP, etc
var info = {};
// If your site is on CloudFlare, then you can use '/cdn-cgi/trace' instead
$.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
  data = data.split('\n');
  $.each(data, function(index, i) {
    if (i.length==0) {
      return;
    }
    var i = i.split("=");
    var key = i[0];
    var value = i[1];
    info[key] = value;
  });
});

var db = firebase.firestore();

export function sendToDB() {
  var finishedForm = document.getElementById("form"); 
  var form_json = form.formToJSON(finishedForm.elements);
  var uid = cookies.getCookie("uid");
  db.collection("web_data").doc(uid).set({
    "uid": uid,
    "browser_info": info,
    "form": form_json
  }).catch(function(error) {
        console.error("Error adding document: ", error);
  });
	localStorage.setItem("data", JSON.stringify(form_json));
}

export function incrementUsers() {
  var docRef = db.collection("web_stats").doc("statistics");
  var increment = firebase.firestore.FieldValue.increment(1);
	docRef.update({
			user_count: increment 
	})
	.then(function() {
			console.log("Document successfully updated!");
	})
	.catch(function(error) {
			// The document probably doesn't exist.
			console.error("Error updating document: ", error);
	});
}

export function getNumUsers() {
  var docRef = db.collection("web_stats").doc("statistics");
  docRef.get().then(function(doc) {
    user_count = doc.data().user_count;
		//user_count = Math.max(559, user_count);
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


  }).catch(function(error) {
        console.error("Error adding document: ", error);
  });
}
