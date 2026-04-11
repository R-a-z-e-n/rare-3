const axios = require('axios');

async function testOtp() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/send-otp', {
      phone: '9876543210'
    });
    console.log('Success:', res.data);
  } catch (error) {
    if (error.response) {
      console.error('Failed:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testOtp();
