'use server';

import { db } from '@/lib/db';
import { feedbacks } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers, cookies } from 'next/headers';

export async function addFeedback(type: 'love' | 'hate', message: string) {
  if (!message || message.trim() === '') {
    throw new Error('Message cannot be empty');
  }

  const cookieStore = await cookies();
  if (cookieStore.get('has_submitted_feedback')) {
    throw new Error('You have already submitted your feedback.');
  }

  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '';

  if (ip) {
    const existing = await db.select().from(feedbacks).where(eq(feedbacks.ipAddress, ip)).limit(1);
    if (existing.length > 0) {
      cookieStore.set('has_submitted_feedback', 'true', { maxAge: 60 * 60 * 24 * 365 }); // 1 year
      throw new Error('You have already submitted your feedback.');
    }
  }

  await db.insert(feedbacks).values({
    type,
    message,
    ipAddress: ip || null,
  });

  cookieStore.set('has_submitted_feedback', 'true', { maxAge: 60 * 60 * 24 * 365 }); // 1 year

  revalidatePath('/');
}

export async function getFeedbacks() {
  return await db.select().from(feedbacks).orderBy(desc(feedbacks.createdAt)).limit(50);
}
