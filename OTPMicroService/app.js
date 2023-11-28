const jwt = require('jsonwebtoken');
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 80; // You can change the port as needed
app.use(cors()); // Enable CORS for all routes

// Create a random OTP generation function
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail', 'Outlook'
  auth: {
    user: 'robustarcade2023@gmail.com',
    pass: 'dygm uyqr ebcb tpoq',
  },
});

// Store generated OTPs and associated email addresses
const otpStore = new Map();

// Create an API endpoint for generating OTPs and sending emails
app.get('/generateOTP', (req, res) => {
  const email = req.query.email;
  const otp = generateOTP();

  // Store the OTP and associated email for later validation
  otpStore.set(email, otp);

  // Send the OTP to the user's email
  const mailOptions = {
    from: 'robustarcade2023@gmail.com',
    to: email,
    subject: 'Your OTP for My Website',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending OTP.');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('OTP sent successfully.');
    }
  });
});

// Create an API endpoint for verifying OTPs
app.get('/verifyOTP', (req, res) => {
  const email = req.query.email;
  const enteredOTP = req.query.otp;

  if (otpStore.get(email) === parseInt(enteredOTP, 10)) {
    // OTP is valid
    otpStore.delete(email); // Remove the OTP from storage after successful validation
    res.status(200).send('OTP verified successfully.');
  } else {
    // Invalid OTP
    res.status(400).send('Invalid OTP.');
  }
});

// Create an API endpoint to send a JWT token to the client after OTP verification
app.get('/sendToken', (req, res) => {
  const email = req.query.email;
  try {
    const token = jwt.sign({ email }, '123456'); // Replace with your own secret key
    res.json({ token });
  } catch (error) {
    console.error('Error signing JWT token:', error);
    res.status(500).send('Error signing JWT token.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

