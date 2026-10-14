# Ominous for Windows

Download **Ominous-Setup-1.0.0-x64.exe**, then double-click it. Installation is for your Windows user and creates desktop and Start menu shortcuts. No Node.js, terminal, account, Python or separate browser runtime is needed. The app works offline after installation.

This first build is unsigned. Windows may show an unknown-publisher or SmartScreen prompt. Use only the exact file from your trusted delivery and compare its SHA-256 when needed. A signed installer will require a publisher certificate.

## What this app does

Edit a message, preview the repository's Core 24 ghost presentation, open a separate presentation window, and export an offline HTML presentation with JSON and SRT captions. Each text field has an Include checkbox. Private notes stay in your project and do not go into the public export. Save a copy produces a .ominous.json file with all project content, including notes.

Drafts save automatically shortly after editing, every 30 seconds when needed, and on close. A damaged draft is preserved in a separate recovery file. Your draft is stored in `%APPDATA%\Ominous`. Uninstalling the app preserves that data. Open a saved project copy to move work between computers.

This repository provides Core 24's presentation system. The Windows app does not contain a local AI model or running implementations of the other 23 cores. Casper retains his coordinator identity.

## Installation and updates

Target: Windows 11 x64. About 500 MB free disk space is recommended for the installed runtime plus setup. Use Windows Settings → Apps → Installed apps → Ominous → Uninstall to remove it. Installing a newer compatible setup updates the program while preserving drafts. Help → Ominous releases opens the repository's releases page in your default browser. There is no automatic updater in this version.

## Rebuild

With Node 24 installed: `npm ci`, `npm test`, `npm run dist:win`.
GitHub Actions builds the installer on a Windows runner, installs it, exercises the installed app, captures a screenshot, and checks uninstall/data retention. See the actual run results for what passed; the workflow file alone is not evidence of execution.
