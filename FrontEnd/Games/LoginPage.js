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
  //I dont know why the flip card is down here but its whatever
    // Show an error message if the email matches the domain
    flipCard();
    errorMessage.style.display = 'block';
  }
});

verifyOTPButton.addEventListener('click', verifyOTP);

function requestOTP() {
  const email = emailInput.value;
  // Make an API request to your /generateOTP endpoint
  fetch(`http://52.54.173.132:3000/generateOTP?email=${email}`)
    .then((response) => response.text())
    .then((data) => {
      alert(data); // Display the API response to the user
    });
}

function verifyOTP() {
  const email = emailInput.value;
  const enteredOTP = otpInput.value;

  fetch(`http://52.54.173.132:3000/verifyOTP?email=${email}&otp=${enteredOTP}`)
    .then((response) => response.text())
    .then((data) => {
      if (data === 'OTP verified successfully.') {
        // OTP is verified successfully

        // Make an API request to retrieve the user's email
        fetch(`http://52.54.173.132:3000/sendToken?email=${email}`)
    		.then((response) => response.json())
    		.then((tokenData) => {
			// Store the token in localStorage
      			localStorage.setItem('token', tokenData.token);
			// Redirect to LandingPage.html
      			window.location.href = '../Games/LandingPage.html';
    		})
    		.catch((error) => {
      			alert('Error: ' + error);
    		});
      } else {
        alert(data); // Display an error message if OTP verification fails
      }
    })
    .catch((error) => {
      alert('Error: ' + error); // Display an error message if the fetch request fails
    });
}

function validateEmail(email) {
  const regex = /@etsu\.edu$/;
  return regex.test(email);
}

function flipCard() {
  flipper.classList.toggle('flip');
}

