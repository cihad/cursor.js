import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Cursor.js privacy policy.',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
        <p>
          Cursor.js collects only the information required to operate the site, process purchases,
          deliver licenses, and provide support.
        </p>
        <p>
          Contact details, order references, and license-related records may be retained for
          billing, fraud prevention, and customer service purposes.
        </p>
        <p>
          Privacy requests can be sent to
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
