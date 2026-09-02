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

// Fired from /admin/orders when you mark an order shipped — the first
// actual "your order is on its way" email the site sends (Stripe's own
// receipt covers the purchase confirmation, but has no idea about
// shipping or tracking).
export async function sendShippingEmail(order: {
  email: string;
  name: string;
  trackingNumber?: string;
  carrier?: string;
}) {
  const hasTracking = Boolean(order.trackingNumber);

  const result = await getResend().emails.send({
    from: 'RYVOL <hello@ryvol.shop>',
    to: order.email,
    subject: 'Your order is on its way.',
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
              <td align="center" style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 400; font-size:30px; line-height:1.15; color:#14161a; padding-bottom:22px;">
                On its way${order.name ? `, ${order.name.split(' ')[0]}` : ''}.
              </td>
            </tr>
            <tr>
              <td align="center" style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:14px; line-height:1.9; color:#55575c; padding-bottom:${hasTracking ? '26' : '40'}px;">
                Your order has shipped.
              </td>
            </tr>
            ${
              hasTracking
                ? `
            <tr>
              <td align="center" style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:12px; letter-spacing:1px; color:#14161a; background-color:#EDEAE3; padding:16px 20px; border-radius:2px;">
                ${order.carrier ? `${order.carrier} — ` : ''}${order.trackingNumber}
              </td>
            </tr>
            <tr><td style="padding-bottom:34px;"></td></tr>`
                : ''
            }
            <tr>
              <td align="center" style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size:13px; letter-spacing:1px; color:#14161a; padding-bottom:28px;">
                Unryvoled Pursuit
              </td>
            </tr>
            <tr>
              <td align="center" style="border-top:1px solid #ddd9d0; padding-top:22px; font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:11px; color:#9a9a9a;">
                Questions about your order? Just reply to this email.
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

// Fired by the daily cron job (see /api/cron/review-requests) a week after
// an order ships — nudges the customer to actually leave a review instead
// of relying on them to think of it themselves. `items` come straight from
// the order's stored snapshot; only ones with an `id` get a real deep link
// to that product's review section (older orders placed before item ids
// were captured just won't have one — they fall back to a generic link).
export async function sendReviewRequestEmail(order: {
  email: string;
  name: string;
  items: { id?: string; name: string }[] | null;
}) {
  const firstName = order.name ? order.name.split(' ')[0] : '';

  const itemsHtml =
    order.items && order.items.length > 0
      ? order.items
          .map((item) => {
            const href = item.id ? `${SITE_URL}/shop/${item.id}#reviews` : `${SITE_URL}/shop`;
            return `
            <tr>
              <td style="padding:14px 0; border-bottom:1px solid #ddd9d0;">
                <span style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size:15px; color:#14161a;">${item.name}</span>
                <br/>
                <a href="${href}" style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:#111B2B; text-decoration:underline;">Leave a review</a>
              </td>
            </tr>`;
          })
          .join('')
      : '';

  const result = await getResend().emails.send({
    from: 'RYVOL <hello@ryvol.shop>',
    to: order.email,
    subject: 'How are you liking it?',
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
              <td align="center" style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-weight: 400; font-size:28px; line-height:1.2; color:#14161a; padding-bottom:22px;">
                How are you liking it${firstName ? `, ${firstName}` : ''}?
              </td>
            </tr>
            <tr>
              <td align="center" style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:14px; line-height:1.9; color:#55575c; padding-bottom:34px;">
                It's been about a week since your order shipped — a quick review helps other people find their way to RYVOL, and it means a lot to us directly.
              </td>
            </tr>
            ${itemsHtml ? `<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemsHtml}</table></td></tr><tr><td style="padding-bottom:12px;"></td></tr>` : ''}
            <tr>
              <td align="center" style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size:13px; letter-spacing:1px; color:#14161a; padding-top:20px; padding-bottom:28px;">
                Unryvoled Pursuit
              </td>
            </tr>
            <tr>
              <td align="center" style="border-top:1px solid #ddd9d0; padding-top:22px; font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:11px; color:#9a9a9a;">
                Questions about your order? Just reply to this email.
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

// Fired the moment a Stripe checkout session completes — so you find out
// about a sale instantly instead of having to remember to check
// /admin/orders. Best-effort, same pattern as the review notification:
// never let a flaky send take down the webhook that actually records the
// order.
export async function sendNewSaleEmail(order: {
  name: string;
  email: string | null;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  amountTotal: number | null;
  items: { name: string; size?: string; quantity: number; price: number }[] | null;
}) {
  const total =
    order.amountTotal != null ? `$${(order.amountTotal / 100).toFixed(2)}` : '—';

  const itemsHtml =
    order.items && order.items.length > 0
      ? order.items
          .map(
            (item) =>
              `${item.quantity}× ${item.name}${item.size ? ` (${item.size})` : ''} — $${item.price.toFixed(2)}`
          )
          .join('<br/>')
      : 'No item details';

  const addressLine = order.address
    ? `${order.address}, ${order.city}, ${order.state} ${order.postal_code}, ${order.country}`
    : 'No address on file';

  const result = await getResend().emails.send({
    from: 'RYVOL <hello@ryvol.shop>',
    to: ADMIN_EMAIL,
    subject: `New order — ${order.name || 'Unnamed'} — ${total}`,
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
                New Order
              </td>
            </tr>
            <tr>
              <td style="font-family: Georgia, 'Times New Roman', serif; font-style: italic; font-size:26px; color:#14161a; padding-bottom:4px;">
                ${order.name || 'Unnamed order'}
              </td>
            </tr>
            <tr>
              <td style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:18px; color:#111B2B; padding-bottom:18px;">
                ${total}
              </td>
            </tr>
            <tr>
              <td style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:14px; line-height:1.8; color:#14161a; background-color:#EDEAE3; padding:20px; border-radius:2px;">
                ${itemsHtml}
              </td>
            </tr>
            <tr>
              <td style="font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:12px; line-height:1.8; color:#55575c; padding-top:16px; padding-bottom:32px;">
                Ship to: ${addressLine}<br/>
                ${order.email ? `Email: ${order.email}` : ''}
              </td>
            </tr>
            <tr>
              <td>
                <a href="${SITE_URL}/admin/orders" style="display:inline-block; padding:12px 30px; background-color:#14161a; font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#F2F0EB; text-decoration:none;">
                  View Orders
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
