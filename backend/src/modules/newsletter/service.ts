import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/AppError.js";

export async function subscribe(email: string) {
  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

  if (existing) {
    if (existing.isActive) {
      throw AppError.conflict("Email is already subscribed");
    }
    // Re-activate
    await prisma.newsletterSubscriber.update({
      where: { id: existing.id },
      data: { isActive: true, unsubscribedAt: null, subscribedAt: new Date() },
    });
    return { message: "Welcome back! Subscription re-activated." };
  }

  await prisma.newsletterSubscriber.create({ data: { email } });
  return { message: "Subscribed successfully" };
}

export async function unsubscribe(email: string) {
  const sub = await prisma.newsletterSubscriber.findUnique({ where: { email } });
  if (!sub || !sub.isActive) {
    return { message: "Unsubscribed successfully" }; // Don't reveal existence
  }

  await prisma.newsletterSubscriber.update({
    where: { id: sub.id },
    data: { isActive: false, unsubscribedAt: new Date() },
  });
  return { message: "Unsubscribed successfully" };
}
