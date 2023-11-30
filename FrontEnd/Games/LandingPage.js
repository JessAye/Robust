const token = localStorage.getItem('token');

if (token) {
  // Decode the token and extract user information
  const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding JWT payload

  if (decodedToken && decodedToken.email) {
    const userEmail = decodedToken.email;

    // Customize content using the user's information
    const welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.textContent = `Hello, ${userEmail}`;
  } else {
    console.error('Invalid token format');
  }
} else {
  // Handle cases where the user is not authenticated
  // You can display a default message or redirect to the login page
}

