# 📘 AgileFlow Documentation

The official documentation for **AgileFlow** - a comprehensive agile project management system built with **Next.js** and powered by **Fumadocs**.

## ⚙️ Getting Started

Navigate to the docs directory and run the development server:

```bash
$ cd docs
$ pnpm install
$ pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser. The root path automatically redirects to the documentation.

## 📁 Project Structure

```bash
.
├── src/
│   ├── app/
│   │   ├── (home)/          # Redirects to /docs
│   │   ├── docs/            # Documentation pages
│   │   └── api/search/      # Search API route
│   ├── components/          # React components
│   ├── lib/                 # Utilities
│   └── layout.config.tsx    # Layout options
├── content/
│   └── docs/                # MDX documentation files
└── source.config.ts         # MDX config (frontmatter, sidebar, etc.)
```

---

## ✍️ How to Write Docs

1. Create `.mdx` pages inside the `content/docs/` folder.
   Example:

   ```bash
   content/docs/guide/getting-started.mdx
   ```

2. Customize sidebar, groups, and ordering in `source.config.ts` using `defineConfig()`.

3. Use Fumadocs UI components directly in your MDX:

   ```mdx
   import { Card } from "fumadocs-ui/components/card";

   <Card title="Welcome" href="/docs/start" />
   ```

Learn more in the [Fumadocs MDX Guide →](https://fumadocs.dev/docs/mdx)

---

## 🛠 Customization

| Feature    | How to Customize                                    |
| ---------- | --------------------------------------------------- |
| Branding   | Update logo, favicon, meta in `src/app/layout.tsx` and `src/app/layout.config.tsx` |
| Navigation | Edit sidebar/nav in `source.config.ts`              |
| Theme      | Light/dark support is built-in                      |
| Search     | Tweak `src/app/api/search/route.ts` for search behavior |

---

## 📚 Learn More

- 🔗 [Fumadocs Documentation](https://fumadocs.dev)
- 🔗 [Next.js Documentation](https://nextjs.org/docs)
- 🔗 [Learn Next.js](https://nextjs.org/learn)

---

## 📦 Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server

---

> Built for AgileFlow — streamlining agile development workflows.
