import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_USER!,
      pass: process.env.BREVO_SMTP_KEY!,
    },
  });

  await transporter.sendMail({
    from: '"Budget Mind" <process.env.EMAIL_USER>',
    to,
    subject,
    html,
  });
};

export default sendEmail;