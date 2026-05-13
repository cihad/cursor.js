import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t bg-background py-6">
      <div className="container mx-auto flex flex-col gap-3 px-4 text-center text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:text-left">
        <p>&copy; {new Date().getFullYear()} cursor.js. All rights reserved.</p>
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
          <Link href="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="/refund" className="hover:text-foreground">
            Refund Policy
          </Link>
          <a href="mailto:support@cursorjs.com" className="hover:text-foreground">
            support@cursorjs.com
          </a>
        </div>
      </div>
    </footer>
  );
}
