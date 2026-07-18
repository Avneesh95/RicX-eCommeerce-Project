// Sends email via EmailJS's REST API (server-side).
//
// Requires, in EmailJS dashboard -> Account -> Security:
//   "Allow EmailJS API for non-browser applications" turned ON
//   and your Private Key copied into EMAILJS_PRIVATE_KEY below.
//
// Requires an EmailJS template with these variables:
//   {{to_email}}, {{subject}}, {{message}}
// (rename the keys in template_params below if your template uses
//  different variable names)

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

const sendEmail = async (to, subject, text) => {
  try {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          to_email: to,
          subject: subject,
          message: text,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `EmailJS request failed (${response.status}): ${errorText}`
      );
    }

    console.log("Email sent via EmailJS to", to);
  } catch (err) {
    console.error("EmailJS Error:", err.message);
    throw err;
  }
};

module.exports = sendEmail;
