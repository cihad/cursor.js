<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Documentation Guidelines

- **Pro Plugins (`packages/pro`)**: Pro plugins must be explicitly marked with a gem icon both in the Cursor Settings UI components and inside the docs navigation menu to distinguish them from core free plugins. Do NOT use the emoji 💎 directly. Instead, import and use `<Gem />` from `lucide-react` (e.g. `<Gem className="w-3.5 h-3.5 text-orange-500" />`).
- **MDX Options Display**: When documenting configuration options, properties, or APIs in MDX files, never manually write out markdown tables. Instead, use the `<auto-type-table>` component to automatically pull types from source code. Example: `<auto-type-table path="../../../packages/core/src/..." name="OptionsInterface" />`.
