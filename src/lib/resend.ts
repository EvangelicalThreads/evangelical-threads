import { Resend } from 'resend';

// Instantiated lazily (inside each function) rather than once at module
// scope — the Resend constructor throws immediately if the API key is
// missing, and a throw at module-evaluation time happens before any
// try/catch around the calling code can see it, which would take down
// every route that imports this file (e.g. review submissions) over an
// email problem that should only affect the notification itself.
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// Same fallback pattern used in the checkout session route — absolute URL
// needed here since email clients can't resolve relative asset paths.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ryvol.shop';

// Where new-review alerts go — not a secret, so it lives here as a plain
// constant rather than another env var to configure. Change the string if
// this inbox ever changes.
const ADMIN_EMAIL = 'ryvol.shop@gmail.com';

export async function sendWelcomeEmail(email: string, name: string) {
  const result = await getResend().emails.send({
    from: 'RYVOL <hello@ryvol.shop>',
    to: email,
    subject: "You're in.",
    html: `
<!doctype html>
<html>
  <body style="margin:0; padding:0; background-color:#F2F0EB;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F0EB;">
      <tr>
        <td align="center" style="padding:56px 24px;">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%;">
            <tr>
              <td align="center" style="padding-bottom:28px;">
                <img src="${SITE_URL}/brand/ryvol-emblem-navy.png" width="40" height="40" alt="RYVOL" style="display:block; border:0;" />
              </td>
            </tr>
            <tr>
              <td align="center" style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 400; font-size:32px; line-height:1.15; color:#14161a; padding-bottom:22px;">
                You're in${name ? `, ${name}` : ''}.
              </td>
            </tr>
            <tr>
              <td align="center" style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:14px; line-height:1.9; color:#55575c; padding-bottom:6px;">
                Welcome to RYVOL.
              </td>
            </tr>
            <tr>
              <td align="center" style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:14px; line-height:1.9; color:#55575c; padding-bottom:40px;">
                You'll be first to know when the next drop lands.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom:44px;">
                <a href="${SITE_URL}/shop" style="display:inline-block; padding:14px 38px; border:1px solid #14161a; font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; color:#14161a; text-decoration:none;">
                  Shop
                </a>
              </td>
            </tr>
            <tr>
              <td align="center" style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size:13px; letter-spacing:1px; color:#14161a; padding-bottom:28px;">
                Unryvoled Pursuit
              </td>
            </tr>
            <tr>
              <td align="center" style="border-top:1px solid #ddd9d0; padding-top:22px; font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:11px; color:#9a9a9a;">
                You can unsubscribe anytime.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  });

  // The Resend SDK resolves normally even when the API rejects the send
  // (bad domain, unverified sender, etc.) — it doesn't throw, it just
  // returns an `error` field. Without this check that rejection is
  // invisible: the request "succeeds" and nothing ever gets delivered.
  if (result.error) {
    throw new Error(`Resend API error: ${result.error.message}`);
  }
  return result;
}

// Fired whenever someone submits a new review — so you find out the moment
// it happens instead of having to remember to check /admin/reviews.
export async function sendReviewNotificationEmail(review: {
  productId: string;
  name: string;
  email: string;
  rating: number;
  text: string;
}) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

  const result = await getResend().emails.send({
    from: 'RYVOL <hello@ryvol.shop>',
    to: ADMIN_EMAIL,
    subject: `New review — ${review.productId} — ${stars}`,
    html: `
<!doctype html>
<html>
  <body style="margin:0; padding:0; background-color:#F2F0EB;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F0EB;">
      <tr>
        <td align="center" style="padding:48px 24px;">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px; width:100%;">
            <tr>
              <td style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#14161a99; padding-bottom:10px;">
                New Review — Pending Approval
              </td>
            </tr>
            <tr>
              <td style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size:24px; color:#14161a; padding-bottom:4px;">
                ${review.name}
              </td>
            </tr>
            <tr>
              <td style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:16px; color:#111B2B; letter-spacing:2px; padding-bottom:18px;">
                ${stars}
              </td>
            </tr>
            <tr>
              <td style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:14px; line-height:1.8; color:#14161a; background-color:#EDEAE3; padding:20px; border-radius:2px;">
                ${review.text}
              </td>
            </tr>
            <tr>
              <td style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:12px; color:#55575c; padding-top:16px; padding-bottom:32px;">
                Product: ${review.productId}<br/>
                From: ${review.email}
              </td>
            </tr>
            <tr>
              <td>
                <a href="${SITE_URL}/admin/reviews" style="display:inline-block; padding:12px 30px; background-color:#14161a; font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#F2F0EB; text-decoration:none;">
                  Approve or Delete
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  });

  if (result.error) {
    throw new Error(`Resend API error: ${result.error.message}`);
  }
  return result;
}
