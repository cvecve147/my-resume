# JiaXuan Yu Resume (Nuxt SEO)

## Runtime Requirement

- Node.js `20.x`, `22.x`, or `25.x`
- `25.x` is supported in this project by request, but if runtime issues appear, switch to `22.x` first.

```bash
nvm use
pnpm install
```

## Development

```bash
pnpm dev
```

## Production Server (SSR)

```bash
pnpm build
pnpm start
```

`pnpm start` runs `node .output/server/index.mjs`.
Do not run `node .nuxt/dist/server/server.mjs` directly.

## Static Build + Local Preview

```bash
pnpm generate
pnpm serve:static
```

Static files are generated in `.output/public` (and a `dist` symlink).

## Important SEO Config

Set your real domain before deploy:

```bash
NUXT_PUBLIC_SITE_URL=https://your-domain.com pnpm generate
```

This value is used for canonical URL, Open Graph, `robots.txt`, and `sitemap.xml`.

## LLM Search Optimization

This project now includes machine-readable endpoints for LLM retrieval:

- `/llms.txt` (index for AI crawlers)
- `/llms-full.txt` (extended context)
- `/resume.json` (structured machine-readable resume summary)

They are listed in sitemap and exposed via `<link rel="alternate">` in page head.

## Deploy on Vercel (Static)

This repo is configured for static deployment with `vercel.json`:

- Build command: `pnpm generate`
- Output directory: `.output/public`

### 1) Set Environment Variables on Vercel

- `NUXT_PUBLIC_SITE_URL=https://your-real-domain.com`
- `NUXT_PUBLIC_SITE_NAME=JiaXuan Yu Resume` (optional)

### 2) Deploy

```bash
vercel --prod
```

Or import the Git repository in Vercel dashboard and deploy.

### 3) Post-Deploy SEO Checks

- Confirm `https://your-real-domain.com/robots.txt`
- Confirm `https://your-real-domain.com/sitemap.xml`
- Confirm `https://your-real-domain.com/llms.txt`
- Confirm canonical and `hreflang` tags on `/` and `/en`
