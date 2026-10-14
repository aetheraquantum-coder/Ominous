# Ominous Windows desktop

Requested outcome: install and launch Ominous easily on Chad's Windows computer using the existing repository. Assumption: Windows 11 x64, supported by prior device context.

Ship an offline Electron desktop application and a per-user NSIS installer. The installer bundles the runtime, creates Start menu and desktop shortcuts, supports uninstall, and needs no Node.js, terminal, account or administrator elevation. Preserve the existing Core 24 projection and export modules. The app is a presentation studio, not a claim that the 24 planned cores are running AI engines.

The editor has title, summary, caption, explicit inclusion toggles, display state, reduced motion and separate private notes. Preview uses the existing renderer in an isolated frame. Native dialogs open/save projects and select an export parent. Export writes only public HTML/JSON/SRT into a fresh child folder. Draft changes save locally and are flushed on close; corrupt drafts are preserved for recovery. User-facing errors explain recovery without losing the current draft.

Security boundaries: only packaged resources load in the editor; renderer sandbox and context isolation stay enabled; narrow IPC validates its sender and input; external content cannot request filesystem paths. No automatic network, inference, telemetry or updates. A fixed user-initiated repository link provides future versions.

Validation: original suite, project persistence and export regression tests, packaged artifact inspection, and GUI checks where the host permits. Report Windows execution separately from cross-compilation. Source branch and reproducible Windows CI accompany the binary. No signed-publisher claim without a signing certificate.
