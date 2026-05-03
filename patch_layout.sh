cat << 'INNER_EOF' > apps/docs/src/app/docs/layout.tsx
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';
import { Gem } from 'lucide-react';

const PRO_PLUGINS = ['trail', 'geminitts'];

function patchTree(node: any): any {
  if (!node) return node;

  if (node.type === 'page') {
    const isPro = PRO_PLUGINS.some(p => node.url.includes('/plugins/' + p));
    if (isPro) {
      return {
        ...node,
        name: (
          <div className="flex items-center gap-1">
            <span className="text-orange-500 font-medium">{node.name}</span>
            <Gem className="w-3.5 h-3.5 text-orange-500" title="Pro" />
          </div>
        ),
      };
    }
  }

  if (node.children) {
    return { ...node, children: node.children.map(patchTree) };
  }

  return node;
}

export default function Layout({ children }: { children: ReactNode }) {
  const { nav, ...base } = baseOptions();
  
  const originalTree = source.getPageTree();
  const patchedTree = {
    ...originalTree,
    children: originalTree.children.map(patchTree),
  };

  return (
    <DocsLayout tree={patchedTree as any} {...base} nav={{ ...nav, mode: 'top' }}>
      {children}
    </DocsLayout>
  );
}
INNER_EOF
