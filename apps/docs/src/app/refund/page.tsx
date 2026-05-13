import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Cursor.js refund policy.',
};

export default function RefundPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Refund Policy</h1>
      <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
        <p>
          If you run into a billing issue or believe your purchase was made in error, contact us as
          soon as possible at
          {' '}
          <a className="text-foreground underline" href="mailto:support@cursorjs.com">
            support@cursorjs.com
          </a>
          .
        </p>
        <p>
          Refund requests are reviewed case by case, with attention to duplicate charges, technical
          access problems, and accidental purchases.
        </p>
        <p>
          Approved refunds are returned to the original payment method whenever the payment
          provider supports it.
        </p>
      </div>
    </div>
  );
}
