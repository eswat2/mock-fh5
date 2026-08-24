# mock-fh5

A prototype REST server which uses the cars from Forza Horizon 5 (video game).  A technology demonstration leveraging the node micro-services model provided by Vercel.

## dev

This repo is pnpm-only.  To try this locally, run the following:

1. `pnpm install`
2. `pnpm dev`

The `pnpm dev` command allows you to test the Vercel app locally.  It expects an `API_TOKEN` in a local `.env` file & serves the app on port 8082.

## docker

To run it in a container instead -- no Vercel login or token required:

1. `docker build -t mock-fh5 .`
2. `docker run --rm -p 8082:8082 mock-fh5`

## api
> localhost:8082 ...

- [/api][api-root]
- [/api/cars][api-cars]
- [/api/colors][api-colors]
- [/api/makes][api-makes]
- [/api/solution][api-solution]
- [/api/vins][api-vins]

## who

- Richard Hess
- [eswat2.github.io][eswat2-io]


[api-root]: http://localhost:8082/api
[api-cars]: http://localhost:8082/api/cars
[api-colors]: http://localhost:8082/api/colors
[api-makes]: http://localhost:8082/api/makes
[api-solution]: http://localhost:8082/api/solution
[api-vins]: http://localhost:8082/api/vins
[eswat2-io]: https://eswat2.github.io
