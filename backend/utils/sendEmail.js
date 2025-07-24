import mailgun from 'mailgun-js';

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

async function sendEmail({ to, subject, text, html }) {
  const data = {
    from: process.env.MAILGUN_FROM_EMAIL,
    to,
    subject,
    text,
    html,
  };
  return mg.messages().send(data);
}

export default sendEmail; 