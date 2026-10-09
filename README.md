# Ominous · Core 24

A private, standalone screen-safe presentation prototype. The host selects explicitly approved text; the presentation receives only that small public snapshot. It never receives the fixture's private fields. This is a candidate, not an installed Ominous GPT or a connected Onyx core.

## Quick start

Requires Node.js 24. There are no production runtime dependencies.

    npm test
    npm run demo

Open out/public/index.html locally. The same folder contains view.json and captions.srt. The default demonstration uses synthetic data. Its friendly ghost scene, status selector and motion preference are intended for a calm, minimal presentation. This build has not received real-browser visual, interaction or motion acceptance.

The output directory must not already exist. To keep another run:

    node bin/demo.mjs --fixture fixtures/approved.json --out another-output

The output is deliberately not served or hosted. Do not serve the entire project folder: it also contains source fixtures and separate review material. For any later authorized publication, select only the reviewed public output directory.

## Data boundary

Input shape: {record: {title, summary, caption, status, private}, approval: ["title", "summary", "caption"]}.

Only the three named text fields can be approved. Missing approval hides them. Host status is one of idle, loading, ready, blocked, error or cancelled. Every non-ready state clears summary and caption. Selecting ready later does not restore a cleared result; reload the original generated artifact for its original approved snapshot. State controls are explicitly synthetic demonstrations, not reports of real system activity.

The CLI reads only regular files and consumes at most 65,537 bytes to enforce a 65,536-byte input ceiling. Direct API approval arrays must have ordinary indexed data entries without accessors, overridden methods/iterators or extra keys.

Limits: title 80, summary 240 and caption 160 Unicode code points; single-line strings, no C0/DEL controls or U+2028/U+2029 separators. Invalid approved text, status, approval entries or public-schema shape fail closed. Unapproved fields are not recursively copied. Approved markup-like strings are treated as text; HTML and captions are escaped.

An approved field is an intentional disclosure. Putting a secret in an approved title, summary or caption will display it. This is not a secret detector, encryption, source-code access control or a guarantee against inspection/recording. The self-contained HTML includes its own ordinary UI JavaScript; it does not contain the host input or private product source.

## Outputs and diagnostics

- out/public/: HTML presentation, public JSON and SRT caption only
- out/owner-review/receipt.json: source/output digests, public status and verification scope; no raw private fixture text

There is no link or UI route from the public preview to the review record. Folder separation is not authentication or an operating-system access control. Existing products and diagnostic access are not changed. CLI exit 0 means public files were generated, even when the displayed synthetic status is error; malformed JSON, invalid CLI use, read/write failure or an existing output root exit 2 with a generic message.

Never put real credentials or personal secrets in test fixtures. The included OMINOUS_PRIVATE_* strings are synthetic negative-test markers.

## Checks

    npm test
    npm run test:browser

The first command runs projection, states, export, delivery and isolated controller-logic tests. Controller logic uses a minimal fake DOM and is not a browser or visual test.

The browser suite is disabled by default. It reports 10 not-run scenarios in the current restricted environment. No blocked browser launch, loopback route, escalation or altered security setting was retried. Appearance, accessibility in a real browser, interactions and frame cadence remain unverified.

On a separately permitted host with Playwright and Chromium already available, an authorized operator can opt into the browser suite using OMINOUS_BROWSER_QA=1. The harness preserves Chromium sandboxing. Do not enable it here to get around the recorded restriction. Its target is a 15-second foreground run with p95 animation-frame interval <=34 ms and no gap >100 ms, plus static reduced-motion transforms. These are prototype targets on one named host, not established measurements or universal guarantees.

## Scope

No runtime dependencies, network services, accounts, spending, public deployment or product connections. Cores 1–23, Core 1 OG/Mantis and the separate blocked execution work are untouched. Tests of this candidate do not verify those systems. A fresh independent code review and its outcome are recorded with the delivered verification report.

## Review outcome

Independent review found two Important issues, both fixed with regression tests: bounded input consumption and approval-array descriptor consistency. The final source check run has 99 passes, zero failures and 10 browser scenarios not run.

One minor edge case is deferred: invalid browser-controller state input retains the already-approved title, while the host API clears it. Both paths show error and clear result text; normal selector options cannot produce the malformed state. The fake-DOM parity test does not cover the title difference. See verification.json for the exact scope and source hashes.
