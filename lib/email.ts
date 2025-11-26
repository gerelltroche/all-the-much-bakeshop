import { Resend } from 'resend';
import { render } from '@react-email/render';
import { ReactElement } from 'react';

// Allow build-time execution without throwing errors
const RESEND_API_KEY = process.env.RESEND_API_KEY || 'build-time-placeholder';
const FROM_EMAIL = process.env.EMAIL_FROM || 'build-time-placeholder@example.com';

const resend = new Resend(RESEND_API_KEY);

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send an email using Resend with a React Email template
 */
export async function sendEmail({
  to,
  subject,
  react,
}: SendEmailOptions): Promise<SendEmailResult> {
  try {
    const html = await render(react);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send a welcome email to a new subscriber
 */
export async function sendWelcomeEmail(
  to: string,
  name?: string
): Promise<SendEmailResult> {
  // Template will be imported once created
  const { WelcomeEmail } = await import('@/emails/WelcomeEmail');

  return sendEmail({
    to,
    subject: 'Welcome to All the Much Bake Shop!',
    react: WelcomeEmail({ name, email: to }),
  });
}

/**
 * Send an order confirmation email
 */
export async function sendOrderConfirmationEmail(
  to: string,
  orderDetails: {
    orderNumber: number;
    customerName: string;
    cookies: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    fulfillmentType: 'pickup' | 'delivery';
    fulfillmentDetails: string;
    fulfillmentDate: Date;
  }
): Promise<SendEmailResult> {
  // Template will be imported once created
  const { OrderConfirmationEmail } = await import('@/emails/OrderConfirmationEmail');

  return sendEmail({
    to,
    subject: `Order Confirmation - ${orderDetails.orderNumber}`,
    react: OrderConfirmationEmail(orderDetails),
  });
}

/**
 * Send Katie an order notification email
 */
export async function sendKatieOrderNotification(
  orderDetails: {
    orderNumber: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    orderType: 'individual' | 'business' | 'group';
    businessName?: string;
    cookies: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    fulfillmentType: 'pickup' | 'delivery';
    fulfillmentDetails: string;
    fulfillmentDate: Date;
    dropName?: string;
  }
): Promise<SendEmailResult> {
  const { KatieOrderConfirmationEmail } = await import('@/emails/KatieOrderConfirmationEmail');

  return sendEmail({
    to: 'katie@allthemuchbakeshop.com',
    subject: `KA-CHING! Order #${orderDetails.orderNumber} - $${orderDetails.total}`,
    react: KatieOrderConfirmationEmail(orderDetails),
  });
}

export async function batchSendEmail(
  recipients: string[],
  subject: string,
  react: ReactElement
): Promise<{ total: number; successful: number; failed: number; errors: string[] }> {
  const results = {
    total: recipients.length,
    successful: 0,
    failed: 0,
    errors: [] as string[],
  };

  // Send in batches to avoid rate limits
  const BATCH_SIZE = 10;
  const DELAY_MS = 1000; // 1 second delay between batches

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);

    const promises = batch.map(async (email) => {
      const result = await sendEmail({ to: email, subject, react });
      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push(`${email}: ${result.error}`);
      }
    });

    await Promise.all(promises);

    // Add delay between batches (except for last batch)
    if (i + BATCH_SIZE < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }
  }

  return results;
}
