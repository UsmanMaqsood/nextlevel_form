const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  const { name, email, subject, message } = req.body;

  return new Promise((resolve, reject) => {
    /**
     * First we setup a 'transporter' which contains our credentials.
     * I'm sure there is a better way to protect this information but for now
     * it's stuffed in environment variables
     */
    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USER,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASS
      }
    });

    /**
     * Then we can call the transporter.sendMail method, which will actually send the
     * email. There are two options on sendMail, you can use a callbacak function, or
     * if a callback is not specified, it returns a Promise.
     */
    transporter
      .sendMail({
        from: email, // sender address
        to: process.env.NEXT_PUBLIC_EMAIL_SEND_TO, // list of receivers
        subject: subject, // Subject line
        text: message, // plain text body
        html: `<div>${message} <br /><br />Thank you,<br />${name}</div>` // html body
      })
      .then((response) => {
        // On a successful email send
        res
          .status(200)
          .json({ error: false, emailSent: true, errors: [], response });
        resolve();
      })
      .catch((error) => {
        res
          .status(500)
          .json({ error: true, emailSent: false, errors: [error] });
        reject(new Error(error));
      });
  });
}
