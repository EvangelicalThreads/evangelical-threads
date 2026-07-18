import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendWelcomeEmail(email: string, name: string) {
  return await resend.emails.send({
    from: 'RYVOL <hello@ryvol.shop>',
    to: email,
    subject: 'Welcome to RYVOL',
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #1a1a1a; max-width: 480px;">
        <h1 style="text-transform: uppercase; letter-spacing: 0.08em; font-size: 20px;">You're in${name ? `, ${name}` : ''}.</h1>
        <p>Thanks for joining RYVOL.</p>
        <p>This brand is for the overlooked — the unranked who win anyway.</p>
        <p>You'll be first to know when Drop 1 goes live.</p>
        <p style="text-transform: uppercase; letter-spacing: 0.12em; font-size: 12px; margin-top: 24px;">Unryvoled Pursuit</p>
        <br/>
        <p style="color: #999; font-size: 12px;">You can unsubscribe anytime.</p>
      </div>
    `,
  });
}
