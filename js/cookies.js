import * as cookies from "./cookies.js";
import * as db from "./db.js";

export function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

export function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

export function getRandomUUID() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function initializeIdentity() {
  var uid = cookies.getRandomUUID();
  cookies.setCookie("uid", uid, 1024);
  localStorage.setItem("uid", uid);
	localStorage.setItem("data", JSON.stringify({}));
  db.incrementUsers();
  return uid;
}
