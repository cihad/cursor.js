import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';
import { SiteFooter } from '@/components/SiteFooter';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <HomeLayout {...baseOptions()}>
        <main className="flex-1">{children}</main>
      </HomeLayout>
      <SiteFooter />
    </>
  );
}
