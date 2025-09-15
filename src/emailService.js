// src/emailService.js - EmailJS via CDN (no installation needed)

export async function sendWelcomeEmail(userType, email, userData) {
  try {
    // Load EmailJS from CDN if not already loaded
    if (!window.emailjs) {
      await loadEmailJS();
    }

    // Initialize EmailJS with your public key
    window.emailjs.init('pI_tUmMg_en8pr6QA');

    // Determine which template to use
    const templateId = userType === 'founder_member' 
      ? 'template_le4czfc'  // Founder Member Welcome
      : 'template_au40tsa'; // Supplier Welcome

    // Prepare template parameters
    const templateParams = {
      user_name: userData.full_name || userData.contact_person || 'Friend',
      user_email: email,
      business_name: userData.business_name || '',
      city: userData.city || '',
      state: userData.state || '',
      role: userData.role || '',
      business_category: userData.business_category || '',
      to_email: email // EmailJS needs this to know where to send
    };

    console.log('Sending email via EmailJS...');
    console.log('Template ID:', templateId);
    console.log('Template params:', templateParams);

    // Send email using EmailJS
    const result = await window.emailjs.send(
      'service_fnmekoh',  // Your service ID
      templateId,         // Template ID based on user type
      templateParams      // Data to fill the template
    );

    console.log('EmailJS success:', result);
    return { success: true, result: result };

  } catch (error) {
    console.error('EmailJS error:', error);
    return { success: false, error: error.message };
  }
}

// Function to load EmailJS from CDN
function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => {
      console.log('EmailJS loaded from CDN');
      resolve();
    };
    script.onerror = () => {
      reject(new Error('Failed to load EmailJS'));
    };
    document.head.appendChild(script);
  });
}