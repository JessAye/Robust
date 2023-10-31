var loginButton = document.getElementById("loginButton");
var registerButton = document.getElementById("registerButton");

loginButton.onclick = function(){
  document.querySelector("#flipper").classList.toggle("flip");
}

registerButton.onclick = function(){
  document.querySelector("#flipper").classList.toggle("flip");
}