import { db } from '~/server/db'
import { z } from 'zod'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { type WebhookEvent } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
const PayloadSchema = z.object({
  data: z.object({
    first_name: z.string(),
    last_name: z.string(),
    image_url: z.string(),
    profile_image_url: z.string(),
    email_addresses: z.array(z.object({
      email_address: z.string().email()
    })).nonempty()
  })
})



  const payload = PayloadSchema.parse(await req.json())
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  
  const eventType = evt.type;

  if (['user.created', 'user.updated'].includes(eventType)) {
    
    const { first_name, last_name, image_url, profile_image_url } = payload.data;
    
    if (!id) return new Response('Error occurred', {
      status: 400
    })
    
    await db.user.upsert({
      where: { id: evt.data.id },
      update: {
        firstName: first_name ?? 'FirstName',
        surname: last_name ?? 'LastName',
        email: payload.data.email_addresses[0].email_address,
        avatarUrl: image_url ?? profile_image_url ?? ''
      },
      create: {
        id: id,
        firstName: first_name ?? 'FirstName',
        surname: last_name ?? 'LastName',
        email: payload.data.email_addresses[0].email_address,
        avatarUrl: image_url ?? profile_image_url 
      },
    })
  } else if (eventType === 'user.deleted') {
    if (!id) return new Response('Error occurred', {
      status: 400
    })
    await db.user.delete({
      where : { id: id}
    })

  }

  return new Response('', { status: 200 })
}