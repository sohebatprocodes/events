const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const { static } = require("express");

sgMail.setApiKey(process.env.SENDGRID_KEY);

const port = process.env.PORT;

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(helmet());
app.use(cors());

app.post("/mail", async (req, res, next) => {
  const {
    name,
    email,
    phone,
    hear,
    organisation,
    selectedEvent,
    selectedTime,
  } = req.body;

  await sgMail
    .send({
      to: email,
      bcc: "wecare@investography.in",
      from: "learn@theunimoney.com",
      subject: `Online workshop - ${selectedEvent} ${phone}`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <style>
            p {
              margin: 0;
            }
          </style>
          <title>Online Workshop - ${selectedEvent} ${selectedTime}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <body style="margin: 0; padding: 0">
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              width="600"
              style="border-collapse: collapse"
            >
              <tr>
                <td style="padding: 20px 0 0 0">
                  <p style="margin: 0">Hello ${name},</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 0 40px 0">
                  <p style="margin: 0">Thanks for signing up for the workshop.</p>
                  <br />
                  <p>Pre workshop:</p>
                  <p>Do sign in 2 mins before the session.</p>
                  <p>
                    Keep your questions ready so you utilise this session to the max.
                  </p>
                  <p>You could keep a pen, paper handy to make notes.</p>
                  <br />
                  <br />
                  <p>Post workshop:</p>
                  <p>
                    You will receive an email for feedback, do share so we can ensure
                    our workshops get better everyday.
                  </p>
                  <p>Evaluate what you wanted vs what you got.</p>
                  <p>
                    Do drop in an email to shweta@investography.in to connect in the
                    future, happy to help.
                  </p>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="margin: 0">Regards,</p>
                  <p>Shweta Jain</p>
                </td>
              </tr>
            </table>
          </body>
        </head>
      </html>`,
    })
    .then((data) => {
      res.json({
        success: true,
        message: "Registered successfullyx",
      });
    })
    .catch((err) => console.error(err));
});

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "🍰️" : error.stack,
  });
});

app
  .listen(port, () => {
    console.info(`Server started on http://localhost:${port}`);
  })
  .on("error", (err) => {
    console.error("Server crased", err);
  });
