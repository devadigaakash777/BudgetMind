import nodemailer from 'nodemailer';

const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your-email@gmail.com',           // ✅ Your Gmail address
        pass: 'your-16-character-app-password', // ✅ Google App Password
      },
    });

    await transporter.sendMail({
      from: '"Expense Tracker" <your-email@gmail.com>',
      to,
      subject,
      html,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;
