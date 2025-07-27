import mailgun from 'mailgun-js';

let mg = null;

// Only initialize Mailgun if API key and domain are provided
if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
  try {
    mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN,
    });
    console.log('✅ Mailgun initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Mailgun:', error.message);
    mg = null;
  }
} else {
  console.log('⚠️ Mailgun not configured - API key or domain missing');
}

async function sendEmail({ to, subject, text, html }) {
  if (!mg) {
    console.log('📧 Email service not configured, skipping email send');
    return { success: false, message: 'Email service not configured' };
  }

  try {
    const data = {
      from: process.env.MAILGUN_FROM_EMAIL || 'noreply@yourdomain.com',
      to,
      subject,
      text,
      html,
    };
    const result = await mg.messages().send(data);
    console.log('📧 Email sent successfully:', result);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    return { success: false, error: error.message };
  }
}

export default sendEmail; 