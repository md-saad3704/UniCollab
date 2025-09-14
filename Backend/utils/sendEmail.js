const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Store securely in .env

const sendEmail = async (to, subject, text, html = null) => {
  const msg = {
    to,
    from: "your_verified_sender@example.com", // Must be a verified sender
    subject,
    text,
    html: html || `<p>${text}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent to:", to);
  } catch (error) {
    console.error("SendGrid Error:", error.response?.body || error);
    throw error;
  }
};

module.exports = sendEmail;
