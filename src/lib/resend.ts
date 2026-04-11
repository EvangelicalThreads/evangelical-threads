import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendWelcomeEmail(email: string, name: string) {
  return await resend.emails.send({
    from: 'Evangelical Threads <welcome@evangelicalthreads.com>',
    to: email,
    subject: `Welcome, ${name}! ✨`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h1>Hey ${name},</h1>
        <p>Thanks for joining Evangelical Threads! ✨</p>
        <p>You are the light of the world. Let your light shine.</p>
        <p>We'll keep you updated with new drops and reflections soon.</p>
        <br/>
        <p style="color: #999;">You can unsubscribe anytime.</p>
      </div>
    `,
  });
}
