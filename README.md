# zApp DAOs

## Running locally

This app is designed to be hosted in an app container (such as [zOS](https://github.com/zer0-os/zOS)). However, it can be run locally for better DX.

`npm run dev`

## Building for production (JS bundle)

This will give you the final bundle to be used in the app container, e.g. `<DaosApp />`.

`npm run build`

## Building for isolated hosting (HTML bundle)

This is a hosted version of the isolated development environment.

`vite build --config ./dev-environment/vite.config.ts`
