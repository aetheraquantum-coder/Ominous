# Ominous Desktop 1.0.0 — verification

Source baseline: `aetheraquantum-coder/Ominous` main commit `3373b7a273a7a82534c7bddf978f628e4c359409`.

## Checked

- Original source suite: 99 tests passed on Node 24.19.0.
- Combined source, persistence and controller suite after review fixes: 114 tests passed, 0 failed, 0 skipped.
- Independent app review identified three Important issues. Regression tests first reproduced each; fixes protect an unread original draft, allow Save a copy when autosave fails, and disable editing during close-save.
- Public export tests cover private-note exclusion, unchecked-field exclusion, escaping and non-ready state clearing.
- Source JavaScript syntax checked; `git diff --check` clean.

## Build and platform limits

The desktop target is Windows 11 x64. Runtime: Electron 44.7.0. The setup bundles its runtime and uses a per-user NSIS installer with shortcuts, an uninstall entry and retained user data. The Windows executable has Ominous version metadata and the ghost icon.

This is a cross-compiled, unsigned candidate. Native Windows install, launch, visual acceptance, upgrade and uninstall tests have not run. The planned Windows GitHub Actions job is in `.github/workflows/windows-desktop.yml`. Automatic approval review rejected pushing the branch because the owner authorized building but had not explicitly authorized publishing changes. No push, pull request, merge or release was performed.

The source repository's older browser suite remains unrun; no sandbox restriction was disabled. Controller tests use JSDOM, not a real browser, and do not establish appearance, frame cadence or Windows runtime behavior.

Minor review note retained: summary and caption must be single-line text; validation gives an error if newlines are entered.

## Local build decisions

- A source checkout on an isolated desktop branch preserves main.
- A direct NSIS compiler build replaces the Wine-dependent installer assembly step. Native execution remains a separate required check.
- Source changes and reproducible build files are included in the delivery because a remote push remains blocked.

## Final installer artifact

- Setup compiled successfully with no NSIS warnings.
- File: Ominous-Setup-1.0.0-x64.exe, 111,293,565 bytes (106.14 MiB).
- SHA-256: `257ce3ac288aa1622ea3186672395e4a844ff1f2c1944b49a17724f3ace6e861`.
- NSIS archive integrity check: 76 files, Everything is Ok.
- Embedded app.asar matches the packaged archive byte-for-byte; main process, project storage and editor files match the tested source. Fixtures and owner-review records are not packaged.
- App payload: Windows x86-64 PE32+ executable. Installer bootstrap: standard NSIS PE32.
- Application payload source commit: `489919e`; subsequent documentation commits do not change that payload.

These structural checks do not replace native Windows execution.
