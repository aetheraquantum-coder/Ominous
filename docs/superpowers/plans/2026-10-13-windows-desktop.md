# Ominous Windows Desktop Implementation Plan

> Execute inline with superpowers:executing-plans; review the completed branch independently.

**Goal:** Deliver a downloadable Windows installer requiring no developer setup.
**Architecture:** Electron main process owns files; sandboxed editor uses a narrow preload bridge. Existing public projection/export modules remain authoritative.
**Tech Stack:** Node 24, Electron 44.7.0, electron-builder 26.15.3, NSIS.
**Spec:** ../specs/2026-10-13-windows-desktop-design.md

## Global constraints
- Windows 11 x64, per-user install, bundled runtime.
- Keep Casper's name and Ominous Core 24 identity.
- Preserve all existing source tests and disclosure boundaries.
- No signing, device execution or live AI claims without evidence.

## Review focus
- Corrupt drafts must not silently overwrite recovery data.
- Private notes and unapproved copy never enter exports.
- Cancellation leaves the current project unchanged.
- Close flushes the latest draft and failed writes are visible.
- Upgrade/uninstall preserve user drafts.

## Task 1: Project storage and public export
Files: desktop/project.mjs, desktop/test/project.test.mjs.
Interfaces: createProject(), validateProject(value), loadDraft(dir), saveDraft(dir,value), exportPresentation(parent,value).
- Write and run tests for round trip, invalid imports, Unicode limits, corrupt draft preservation, unique export directories and private text exclusion.
- Implement strict project validation, atomic draft writes and bounded reads using existing source code.
- Run the full source and desktop suite.

## Task 2: Native app and editor
Files: desktop/main.mjs, desktop/preload.cjs, desktop/ui/*, desktop/test/ui.test.cjs.
Interfaces: initial/update/open/saveCopy/export/present/reveal/updates through validated IPC.
- Add user flow tests for editing, preview, inclusion, errors, draft recovery and keyboard controls.
- Implement local custom protocol, native dialogs, quit-save handshake, menus and offline editor.
- Verify syntax and run available GUI checks without weakening the production sandbox.

## Task 3: Installer and release evidence
Files: package.json, build/*, .github/workflows/windows-desktop.yml, docs/WINDOWS.md.
- Package Windows x64 with runtime and per-user NSIS setup.
- Inspect PE executables, app archive and installer payload.
- Record actual test/build results and signing/platform limits.
- Commit source and preserve a reviewable branch; deliver installer.
