# CLAUDE.md

Guidance for Claude Code when working in this repo.

## What this is

`mock-fh5` — a prototype REST API server serving Forza Horizon 5 car data, deployed on
Vercel as serverless functions. It exists to give front-end prototypes a realistic,
CORS-open endpoint to fetch against. Live at https://mock-fh5.vercel.app

## Commands

`pnpm` only — `preinstall` runs `only-allow pnpm`, so `npm`/`yarn` will refuse to install.

| command | what it does |
| --- | --- |
| `pnpm dev` | `vc dev` on port 8082 (needs `API_TOKEN` in `.env`, loaded via `env-cmd`) |
| `pnpm test` | mocha over `tests/*.js` |
| `pnpm cc` | prettier check on `api utils tests` |
| `pnpm format` | prettier write (this is also what `pnpm build` runs) |
| `pnpm spell` | cspell over `./**/*.js` |
| `pnpm sample` | dump the parsed CSV to stdout — a scratch script for eyeballing the data |
| `pnpm release` | bump patch + commit/tag/push, then format, test, deploy to prod |

Run `pnpm format && pnpm test && pnpm spell` before considering a change done.

## Layout

```
api/           one file per route, each exports a default (req, res) handler
utils/         shared logic — no framework, plain ESM modules
utils/fh5-raw.csv   the source data (866 cars), committed
tests/         mocha + chai
vercel.json    legacy v2 `builds` + `routes` config
```

Routes are declared **explicitly** in `vercel.json` — adding `api/foo.js` does not create
`/api/foo` on its own. Add a matching entry to `routes`, and list it in the `apis` array in
`api/greetings.js` so `/api` keeps advertising the real set.

Every handler sets `Access-Control-Allow-Origin: *`. Keep doing that — consumers are
browser prototypes on other origins.

## The data pipeline

`utils/fh5-data.js` reads and parses `utils/fh5-raw.csv`, then hands rows to:

- `api/cars.js` — returns the rows verbatim
- `utils/filters.js` `makes()` — unique sorted manufacturer list (`api/makes.js`)
- `utils/mocks.js` `dataSet()` — synthesizes random dealers/vehicles/summary (`api/solution.js`)

### The CSV parser is deliberately bespoke

This used to use `papaparse`. It was replaced with a ~15-line parser because the data is
static, committed, and trivially shaped: **no quoted fields, no embedded commas, no escapes,
LF line endings.** The parser is exact-output-compatible with the old
`Papa.parse(stream, { header: true, dynamicTyping: true })` call — verified row-for-row.

Two things to know before touching it:

- **Rows are ragged on purpose.** The header has 5 columns (`year,make,model,series,pass`)
  but 504 rows carry only 3, 265 carry 4, and 98 carry all 5. Short rows simply omit the
  trailing keys from the object — `/api/cars` returns that uneven shape and consumers only
  rely on `year`/`make`/`model`.
- **`typed()` replicates papaparse's `dynamicTyping`.** Numeric strings become numbers, so
  `series` is a number on some rows and the string `"Welcome Pack"` on others. Don't
  "fix" that without checking consumers.

If the CSV is ever regenerated from a source that quotes fields or embeds commas, this
parser will split them wrong and fail *silently*. That's the accepted trade-off — if the
data source changes, reach for a real parser again rather than growing this one.

`tests/fh5-data.js` pins all of the above — ragged rows, dynamic typing, blank-line
handling, row count, and the cache. Change the parser, run those first.

`fetchData()` is **synchronous and memoized** — parsed once at first call, reused for the
life of the function instance. Handlers call it inline; there is no callback plumbing.

### Don't make the CSV path dynamic

```js
const sampleRawCsv = path.resolve('./utils/fh5-raw.csv')
```

Vercel's file tracing statically analyzes that literal to decide the CSV ships in the
function bundle. Compute the path dynamically and the deploy will build fine but 500 at
runtime with ENOENT.

## Docker

```
docker build -t mock-fh5 .
docker run --rm -p 8082:8082 mock-fh5     # -> http://localhost:8082
```

The container runs `pnpm dev:docker`, which is `vc dev --local --listen 0.0.0.0:8082`.
Three details matter:

- **`--local` skips the Vercel project link**, so the container needs no `API_TOKEN` and no
  login. `.env` and `.vercel` are both in `.dockerignore` — if `.vercel` gets copied in, the
  CLI tries to retrieve the project and dies with "The specified token is not valid" even
  with `--local`.
- **It must bind `0.0.0.0`**, not the plain `--listen 8082` the local `dev` script uses, or
  the port is unreachable from the host.
- **Dependencies are installed inside the image**, never copied from the host — that's how
  the linux build of the vercel CLI native binary gets pulled instead of the darwin one.

`pnpm dev` (the non-docker script) still uses `env-cmd` + `--token $API_TOKEN` from `.env`
and talks to the real linked project.

## Conventions

- ESM everywhere (`"type": "module"`); import Node builtins with the `node:` prefix.
- Prettier config lives in `package.json`: **no semicolons**, single quotes, 2-space indent,
  100 col width, es5 trailing commas.
- Arrow-function consts, named exports collected in a single `export { ... }` at the bottom.
- Explanatory comments are written as `// NOTE:  ...` (two spaces after the colon).
- New proper nouns and library names go in the `words` array in `cSpell.json` or `pnpm spell`
  fails.
- Randomness comes from `chance`, ids from `nanoid`, VINs from `vin-generator` — all
  centralized in `utils/mocks.js`.

## Known rough edges

- `cSpell.json` `ignorePaths` lists `fh5-data.csv`, which doesn't exist — the data file is
  `utils/fh5-raw.csv`. Real car names in source will therefore trip `pnpm spell`; test
  fixtures use neutral placeholder values to avoid it.
- `vercel.json` uses the legacy v2 `builds`/`routes` schema rather than modern
  filesystem routing or `vercel.ts`. It works; migrating is a deliberate change, not a
  drive-by cleanup.
