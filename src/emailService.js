// src/emailService.js

export async function sendWelcomeEmail(userType, email, userData) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: userType,
        email: email,
        userData: userData
      })
    });

    if (response.ok) {
      console.log('Welcome email sent successfully');
      return { success: true };
    } else {
      console.error('Failed to send email');
      return { success: false };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false };
  }
}
