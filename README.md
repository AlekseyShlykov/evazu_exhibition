# Find the Camel!

An immersive, static online exhibition designed to feel like entering a small contemporary gallery. The artwork remains central: navigation is guided, motion is restrained, and the interface recedes into the room.

The application uses Next.js App Router, TypeScript, React Three Fiber, Three.js, Drei, Tailwind CSS, Framer Motion, Google Sheets, React Hook Form, and Zod. It has no application server, authentication layer, API routes, or server-side rendering.

## Installation

Requirements: Node.js 20 or later and npm.

```bash
npm install
npm run dev
```

The exhibition works without external credentials. In that mode, the gallery remains complete, the guestbook displays demonstration entries, and submission buttons explain which integration is missing.

## Production and static export

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run build` runs `next build` with `output: "export"` and writes the complete static website to `out/`. The contents of that directory require only a static file host; Node.js is not needed after the build.

Exported routes are:

- `out/index.html`
- `out/exhibition/index.html`
- `out/guestbook/index.html`

`trailingSlash`, `basePath`, `assetPrefix`, unoptimized images, a reusable path helper, and `.nojekyll` keep routes and assets compatible with GitHub Pages repository subpaths.

## GitHub Pages

The workflow at `.github/workflows/deploy.yml` runs after every push to `main`. It installs dependencies with `npm install`, builds the static export, uploads `out/`, and deploys it with the official GitHub Pages actions.

In the repository’s **Settings → Pages**, set **Source** to **GitHub Actions**. No separate deployment server is required. The workflow derives the repository name from `GITHUB_REPOSITORY` and configures the matching base path automatically.

For a custom-domain deployment, set `NEXT_PUBLIC_BASE_PATH` to an empty value and configure `NEXT_PUBLIC_SITE_URL` to the canonical public URL.

## Google Sheets

1. Create or open one Google Sheet.
2. Open **Extensions → Apps Script**.
3. Replace the editor contents with [`google-apps-script/Code.gs`](google-apps-script/Code.gs) and save.
4. Select **Deploy → New deployment → Web app**.
5. Set **Execute as** to yourself and **Who has access** to anyone, then deploy and authorize it.
6. Copy the resulting `/exec` URL into `.env.local` and GitHub Actions Variables.

Only these public build variables are used:

```text
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_SITE_URL=
```

- `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL`: deployed Google Apps Script web-app URL for postcard requests and the guestbook.
- `NEXT_PUBLIC_BASE_PATH`: optional repository path such as `/my-exhibition`; normally derived by GitHub Actions.
- `NEXT_PUBLIC_SITE_URL`: canonical deployed URL for metadata, robots, and sitemap.

The script automatically creates two tabs: `Postcard requests` and `Guestbook`. New guestbook notes use `approved` and appear immediately. Change the Status cell to `rejected`, `hidden`, or any value other than `approved` to remove a note from the public guestbook. The public endpoint returns only approved notes. Honeypots, cooldowns, length limits, validation, spreadsheet locking and formula-injection protection provide lightweight abuse resistance.

## Artwork management

Artwork metadata lives only in [`src/data/artworks.ts`](src/data/artworks.ts). Components always render from that registry.

To replace an image, put the new file in `public/artworks/`, keep the current filename or update `previewImage` and `fullImage` in the matching registry entry. Images are displayed without cropping and retain their source aspect.

To add an artwork:

1. Place its image in `public/artworks/`.
2. Add one object to `src/data/artworks.ts` with `id`, `slug`, title, description, year, materials, dimensions, preview/full paths, gallery position/rotation, frame size, and merchandise availability.

No component changes are necessary. Use `[x, y, z]` for `galleryPosition`; the room center is near `[0, 1.6, -2]`. `galleryRotation` is in radians. Back wall works face rotation `0`, side walls use `±Math.PI / 2`, and the entrance wall uses `Math.PI`. `frameSize` is `[width, height]` in scene units. Set `merchandiseAvailable` to show or hide preorder access.

Full-resolution artwork files live in `public/artworks/full/`; lightweight gallery copies live in `public/artworks/previews/`.

## Project structure

```text
src/app/                 Static App Router pages and metadata
src/components/loading/ Entrance and real asset progress
src/components/gallery/ Room and artwork geometry
src/components/camera/  Guided camera interpolation
src/components/exhibition/ Exhibition UI and WebGL fallback
src/components/preorder/ Merchandise form and responsive modal
src/components/guestbook/ Guestbook form and editorial entries
src/data/artworks.ts     Single artwork registry
src/lib/paths.ts         GitHub Pages-safe URL construction
src/lib/google-sheets/   Postcard and guestbook data operations
src/lib/validation/      Shared Zod schemas
src/lib/analytics/       Replaceable event abstraction
google-apps-script/      Google Sheets web-app code
public/artworks/         Original works and later placeholder studies
```

## Interaction and resilience

- Actual image load events drive the entrance progress; the Start button remains unavailable until all registered previews settle.
- Drag or swipe rotates the camera. Artwork selection animates without teleporting.
- Numbered controls are keyboard reachable; Arrow keys move between works and Escape returns to the room.
- Artwork query state uses `?artwork=slug` and participates in browser Back/Forward history.
- Mobile retains the full 3D room with constrained DPR and touch-sized controls.
- Browsers without WebGL receive a large-format, sequential catalogue view rather than a card grid.
- Google Sheets failures do not affect the exhibition and preserve unsent form values for retry.

## Analytics

`src/lib/analytics/index.ts` exposes a small adapter and the required event vocabulary. Connect a privacy-respecting provider with `configureAnalytics` without changing UI components. No provider or tracking is enabled by default.
