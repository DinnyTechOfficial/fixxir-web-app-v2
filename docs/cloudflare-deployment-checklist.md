# Cloudflare Pages Deployment Checklist

This checklist is for deploying the current Next.js app as a static site on Cloudflare Pages. It matches the repository's current `next.config.ts`, which enables static export and writes the export to `dist`.

## Before deploying

- [x] `next.config.ts` sets `output: "export"`.
- [x] `next.config.ts` sets `distDir: "dist"` to match the Cloudflare output directory.
- [x] `npm run build` completes successfully and creates `dist`.
- [ ] Confirm the production branch and repository root directory in Cloudflare Pages.
- [ ] Select **Next.js (Static HTML Export)** as the framework preset. Do not select **React (Vite)** for this Next.js project.
- [ ] Set the build command to `npm run build`.
- [ ] Set the build output directory to `dist` to match `distDir` in `next.config.ts`.
- [ ] Save the Pages build settings and trigger a deployment from the intended branch.

## Verify the deployment

- [ ] Confirm the Cloudflare build completes and finds the `dist` output directory.
- [ ] Open the homepage on the deployed domain.
- [ ] Open `/repair/request` directly, refresh it, and complete the form steps.
- [ ] Open `/repair/request/success` directly and check that its assets load.
- [ ] Check the homepage and repair form on a mobile viewport.
- [ ] Check browser console and Cloudflare deployment logs for errors.

## Current functional limits

- The repair form keeps values in browser memory only; it does not send or save repair requests. Visitors are directed to contact Fixxir instead.
- The confirmation route contains no generated request ID because request persistence is not implemented.
- Photo selections are not uploaded or persisted.
- Static export does not run Next.js SSR, API routes, or server actions. Add a separate backend/API or migrate to a server-capable Cloudflare Workers setup when those features are implemented.

## If changing to the default `out` directory

If Cloudflare Pages is configured to output `out`, remove `distDir: "dist"` from `next.config.ts`, keep `output: "export"`, and change the Pages output directory to `out`. The build command can remain `npm run build`.