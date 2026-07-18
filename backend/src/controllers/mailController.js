const sendEmail = require("../config/mailServices");

router.get("/test-mail", async (req, res) => {
  await sendEmail(
    "avneesh952003@gmail.com",
    "Testing",
    "Hello from MERN App"
  );

  res.send("Mail Sent");
});