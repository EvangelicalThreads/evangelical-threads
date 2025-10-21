import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function simulateWebhook() {
  // Fake Stripe session object
  const session = {
    id: 'cs_test_123',
    customer_details: {
      name: 'Test User',
      address: {
        line1: '123 Test St',
        city: 'Testville',
        state: 'CA',
        postal_code: '90001',
        country: 'US',
      },
    },
  };

  // Insert a pending order directly via raw SQL (avoids prepared statement errors)
  await prisma.$executeRawUnsafe(`
    INSERT INTO orders (stripe_session_id, name, address, city, state, postal_code, country, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, session.id, '', '', '', '', '', '', 'pending');

  console.log('Pending order inserted');

  // Call webhook locally
  const res = await fetch('http://localhost:3000/api/stripe/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { object: session } }),
  });

  const data = await res.json();
  console.log('Webhook response:', data);

  // Check updated order
  const order = await prisma.orders.findFirst({
    where: { stripe_session_id: session.id },
  });

  console.log('Final order:', order);
}

simulateWebhook()
  .then(async () => {
    console.log('Webhook simulation complete');
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
