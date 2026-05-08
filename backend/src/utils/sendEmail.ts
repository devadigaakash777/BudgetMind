// utils/sendEmail.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  await resend.emails.send({
    from: 'BudgetMind <onboarding@resend.dev>',
    to,
    subject,
    html,
  });
};

export default sendEmail;