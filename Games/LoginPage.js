var loginButton = document.getElementById("loginButton");
var registerButton = document.getElementById("registerButton");
const requestOTPButton = document.getElementById('request-otp');
const verifyOTPButton = document.getElementById('verify-otp');
const emailInput = document.getElementById('email');
const otpInput = document.getElementById('otp');
const otpForm = document.getElementById('otp-form');
/*
request-otp.onclick = function(){
  document.querySelector("#flipper").classList.toggle("flip");
}
*/
regeneratePass.onclick = function(){
  document.querySelector("#flipper").classList.toggle("flip");
}

// Add event listeners to buttons
requestOTPButton.addEventListener('click', function(event){
document.querySelector("#flipper").classList.toggle("flip");
requestOTP();
});
verifyOTPButton.addEventListener('click', verifyOTP);

function requestOTP() {
  const email = emailInput.value;
  // Make an API request to your /generateOTP endpoint
  fetch(`/generateOTP?email=${email}`)
    .then((response) => response.text())
    .then((data) => {
      alert(data); // Display the API response to the user
    });
}

function verifyOTP() {
  const email = emailInput.value;
  const enteredOTP = otpInput.value;
  // Make an API request to your /verifyOTP endpoint
  fetch(`/verifyOTP?email=${email}&otp=${enteredOTP}`)
    .then((response) => response.text())
    .then((data) => {
      alert(data); // Display the API response to the user
    });
}
