# SWEX Dummy Plugin

Minimal [SW-Exporter](https://github.com/Xzandro/sw-exporter) plugin to test the plugin auto update. It only logs its version.

## Build

```sh
npm install
npm run build   # -> dist/swex-dummy-plugin.asar + dist/latest.yml
```

## Release

The `Release` workflow runs on `v*` tags. It packs the asar, generates `latest.yml` and attaches both to a GitHub release.
The tag must match the `version` in `package.json`.

```sh
npm version patch   # bumps package.json, commits and tags v1.0.1
git push --follow-tags
```

The plugin points `autoUpdate.versionURL` to `releases/latest/download/latest.yml`, so it always checks the newest release.

## Testing the auto update

1. Release `v1.0.0`.
2. Download `swex-dummy-plugin.asar` from that release into `<SWEX Files>/plugins`. Keep the file name, SWEX replaces the file by the name from `latest.yml`.
3. Start SWEX: the log shows `DummyPlugin v1.0.0 loaded.`
4. Release `v1.0.1` (see above).
5. Restart SWEX: it shows the "Plugins can be updated!" dialog. After "Restart SWEX" the log shows `DummyPlugin v1.0.1 loaded.`
