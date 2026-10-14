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

The owner explicitly approved publishing the desktop branch and running Windows tests on October 13, 2026. The branch is published. Windows GitHub Actions run [38505839993](https://github.com/aetheraquantum-coder/Ominous/actions/runs/38505839993) passed on Windows Server 2025 (build 26100), testing commit `8fecbcd8e938bcf31bf62f2340eab65016a653c3`. All 114 source/controller tests passed. Native installer execution, installed app launch, ten app smoke checks, Start menu shortcut, uninstall shortcut removal, and retention of an AppData sentinel passed. The smoke checks cover renderer isolation, preview, editing, autosave, reduced motion, private-note exclusion from export, project copy, field exclusion, close/relaunch recovery, and cancelled open. A test assertion import was corrected before the successful run.

The installer remains unsigned. Interactive installer screens, Windows 11 on the owner's hardware, upgrade behavior, and final user visual acceptance remain unverified. No merge or release was performed.

The source repository's older browser suite remains unrun; no sandbox restriction was disabled. Controller tests use JSDOM, not a real browser, and do not establish appearance, frame cadence or Windows runtime behavior.

Minor review note retained: summary and caption must be single-line text; validation gives an error if newlines are entered.

## Local build decisions

- A source checkout on an isolated desktop branch preserves main.
- A direct NSIS compiler build replaces the Wine-dependent installer assembly step. Native execution remains a separate required check.
- Source changes and reproducible build files are published on `windows-desktop-easy-install`.

## Original cross-compiled installer artifact

- Setup compiled successfully with no NSIS warnings.
- File: Ominous-Setup-1.0.0-x64.exe, 111,293,565 bytes (106.14 MiB).
- SHA-256: `257ce3ac288aa1622ea3186672395e4a844ff1f2c1944b49a17724f3ace6e861`.
- NSIS archive integrity check: 76 files, Everything is Ok.
- Embedded app.asar matches the packaged archive byte-for-byte; main process, project storage and editor files match the tested source. Fixtures and owner-review records are not packaged.
- App payload: Windows x86-64 PE32+ executable. Installer bootstrap: standard NSIS PE32.
- Application payload source commit: `489919e`; subsequent documentation commits do not change that payload.

These structural checks do not replace native Windows execution.

## Windows-tested installer artifact

- Built and tested in run 38505839993 on October 14, 2026 UTC.
- File: Ominous-Setup-1.0.0-x64.exe, 111,178,591 bytes.
- SHA-256: `aa33df9845ac3dee856946e69b339d26f136a312a9ac6489646722450639d145`.
- Downloaded CI ZIP digest matched GitHub; extracted installer SHA-256 matched the runner evidence.
- CI artifact includes the installed-app screenshot, ten smoke-check results, and installer checksum.
