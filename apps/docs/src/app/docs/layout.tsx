import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';
import { Gem } from 'lucide-react';

const PRO_PLUGINS = [
  'trail',
  'geminitts',
  'particle',
  'outline',
  'spotlight',
  'floating-say',
  'floating-prompt',
  'wait-for-user',
  'floating-wait-for-user',
];

function patchTree(node: any): any {
  if (!node) return node;

  if (node.type === 'page') {
    const isPro = PRO_PLUGINS.some(
      (p) => node.url && typeof node.url === 'string' && node.url.includes('/plugins/' + p),
    );
    if (isPro) {
      return {
        ...node,
        name: (
          <span key={node.url} className="inline-flex items-center gap-1.5 flex-1 line-clamp-1">
            <span className="truncate">
              {typeof node.name === 'string' ? node.name : 'Pro Plugin'}
            </span>
            <span title="Pro" className="shrink-0 flex items-center">
              <Gem className="w-3.5 h-3.5 text-orange-500" />
            </span>
          </span>
        ),
      };
    }
  }

  if (node.children && Array.isArray(node.children)) {
    return { ...node, children: node.children.map(patchTree) };
  }

  if (node.pages && Array.isArray(node.pages)) {
    return { ...node, pages: node.pages.map(patchTree) };
  }

  if (node.folder) {
    return { ...node, folder: patchTree(node.folder) };
  }

  return node;
}
export default function Layout({ children }: { children: ReactNode }) {
  const { nav, ...base } = baseOptions();

  const originalTree = source.getPageTree();
  const patchedTree = {
    ...originalTree,
    children: originalTree.children ? originalTree.children.map(patchTree) : [],
  };

  return (
    <DocsLayout tree={patchedTree as any} {...base} nav={{ ...nav, mode: 'top' }}>
      {children}
    </DocsLayout>
  );
}
