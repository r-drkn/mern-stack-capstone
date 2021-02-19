if (process.env.NODE_ENV !== "production") require("dotenv").config();
const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

//HELPERS
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve(__dirname, "../views"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "../views"),
  extName: ".handlebars",
};

transporter.use("compile", hbs(handlebarOptions));

let mailOptions = {
  from: "xxkeefer.test@gmail.com",
  to: "xxkeefer.code@gmail.com",
  subject: "Testing Nodemailer",
  template: "newsletter",
  context: {
    text: "This is a test. Mic check 1 2, 1 2.",
    etc:
      "other values here and the .hbs file will be able to access them with helpers",
  },
};

//EXPORTS

const sendNewsletter = (req, res) => {
  const { from, to, subject, context } = req.body;
  transporter.sendMail(
    { from, to, subject, template: "newsletter", context },
    (err, data) => {
      if (err) {
        res.status(500).json({ message: err.message });
      } else {
        res.status(200).json({ message: `mail sent to: ${to}` });
      }
    }
  );
};

const sendFeedback = (req, res) => {
  const { name, email: user_email, message: feedback } = req.body;

  mailOptions.template = "feedback";
  mailOptions.subject = `FEEDBACK from ${name} @ ${user_email}`;
  mailOptions.context = {
    title: `FEEDBACK from ${name} @ ${user_email}`,
    content: `${feedback}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);

      res.status(500).json({ message: err.response });
    } else {
      console.log(`FEEDBACK:: received from: ${user_email}`);
      res.status(200).json({ message: `mail sent to: ${mailOptions.to}` });
    }
  });
};

module.exports = { sendNewsletter, sendFeedback };
