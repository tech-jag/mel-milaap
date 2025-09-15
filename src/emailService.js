// src/emailService.js - Replace your current file with this

export async function sendWelcomeEmail(userType, email, userData) {
  // Email templates
  const templates = {
    founder_member: {
      subject: "Welcome to Mēl Milaap Founders Circle! 🎉",
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B2635; font-size: 2.5rem; margin: 0;">
              Mēl <span style="color: #F9C64A;">Milaap</span>
            </h1>
            <p style="color: #666;">Find • Match • Marry • Celebrate</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #8B2635; margin-top: 0;">Welcome to the Founders Circle!</h2>
            <p>Dear ${userData.full_name || userData.contact_person || 'Founder'},</p>
            <p>You're now part of an exclusive group shaping the future of South Asian matchmaking in Australia & New Zealand.</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3 style="color: #8B2635;">Your Exclusive Benefits:</h3>
            <ul>
              <li><strong>3 Months Premium Free</strong> - Full access to all features</li>
              <li><strong>Early Access</strong> - First to use the platform</li>
              <li><strong>Priority Support</strong> - Direct line to our team</li>
              <li><strong>Founder Recognition</strong> - Special status badge</li>
            </ul>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 0.9rem; border-top: 1px solid #eee; padding-top: 20px;">
            <p>© 2025 Mēl Milaap. Australia & New Zealand's Most Exclusive South Asian Matrimony Platform</p>
          </div>
        </div>
      `
    },
    supplier: {
      subject: "Welcome to Mēl Milaap Partner Network",
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B2635; font-size: 2.5rem; margin: 0;">
              Mēl <span style="color: #F9C64A;">Milaap</span>
            </h1>
            <p style="color: #666;">Find • Match • Marry • Celebrate</p>
          </div>
          
          <div style="background-color: #f0f8f0; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h2 style="color: #8B2635; margin-top: 0;">Welcome to Our Partner Network!</h2>
            <p>Dear ${userData.contact_person || 'Partner'},</p>
            <p>Thank you for joining ${userData.business_name || 'your business'} to our exclusive supplier network.</p>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 0.9rem; border-top: 1px solid #eee; padding-top: 20px;">
            <p>© 2025 Mēl Milaap. Australia & New Zealand's Most Exclusive South Asian Matrimony Platform</p>
          </div>
        </div>
      `
    }
  };

  try {
    const template = templates[userType] || templates.founder_member;
    
    // Get the API key from environment variables
    const apiKey = import.meta.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.error('Resend API key not found');
      return { success: false, error: 'API key missing' };
    }
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'founders@melmilaap.com',
        to: email,
        subject: template.subject,
        html: template.html
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Welcome email sent successfully', result);
      return { success: true, id: result.id };
    } else {
      console.error('Resend API error:', result);
      return { success: false, error: result };
    }
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
}