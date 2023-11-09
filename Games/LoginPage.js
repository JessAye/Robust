const requestOTPButton = document.getElementById('request-otp');
const verifyOTPButton = document.getElementById('verify-otp');
const emailInput = document.getElementById('email');
const otpInput = document.getElementById('otp');
const flipper = document.getElementById('flipper');
const errorMessage = document.getElementById('error-message');

// Add event listeners to buttons
requestOTPButton.addEventListener('click', function (event) {
  const email = emailInput.value;

  //removes the error message each time the button is pressed
  errorMessage.style.display = 'none';

  // Check if the email does not match the @etsu.edu domain
  if (validateEmail(email)) {
  requestOTP();
  } else {
    // Show an error message if the email matches the domain
    flipCard();
    errorMessage.style.display = 'block';
  }
});

verifyOTPButton.addEventListener('click', verifyOTP);

function requestOTP() {
  const email = emailInput.value;
  // Make an API request to your /generateOTP endpoint on the server
  fetch(`/generateOTP?email=${email}`)
    .then((response) => response.text())
    .then((data) => {
      // Display the API response to the user on the page
      displayMessage(data);
    });
}

function verifyOTP() {
  const email = emailInput.value;
  const enteredOTP = otpInput.value;
  // Make an API request to your /verifyOTP endpoint on the server
  fetch(`/verifyOTP?email=${email}&otp=${enteredOTP}`)
    .then((response) => response.text())
    .then((data) => {
      // Display the API response to the user on the page
      displayMessage(data);
    });
}

function displayMessage(message) {
  const messageElement = document.getElementById('message');
  messageElement.textContent = message;
}

function validateEmail(email) {
  const regex = /@etsu\.edu$/;
  return regex.test(email);
}

function flipCard() {
  flipper.classList.toggle('flip');
}
