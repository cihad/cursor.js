export function SiteFooter() {
  return (
    <footer className="w-full border-t py-6 mt-auto bg-background">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} cursor.js. All rights reserved.</p>
      </div>
    </footer>
  );
}
