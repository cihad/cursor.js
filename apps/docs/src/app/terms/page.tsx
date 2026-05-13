import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Cursor.js terms of service.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
        <p>
          By using cursor.js, you agree to use the software and related services in compliance with
          applicable laws and these terms.
        </p>
        <p>
          Pro purchases grant the license scope described on the pricing page. You are responsible
          for safeguarding any license keys delivered to you.
        </p>
        <p>
          The service is provided on an as-is basis. For support questions, contact
          {' '}
          <a className="text-foreground underline" href="mailto:support@cursorjs.com">
            support@cursorjs.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
