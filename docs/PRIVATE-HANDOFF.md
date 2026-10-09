# Core 24 publication and handoff status

The source is publicly available at https://github.com/aetheraquantum-coder/Ominous. On 2026-10-09, the owner changed the repository from private to public and reported sharing it online. Public access was verified. The original private upload was verified at commit c1e7e9acb5b200f3c72bddd78a4df30d0b8d79fa: all 31 prepared files matched their upload hashes, with one additional preserved seed file at docs/seed-gitattributes.txt. This is source publication only, not a hosted application or wider Foundation deployment.

This file retains its original filename for link continuity. The private handoff and upload blockers below are dated history, not current publication status.

## Provenance and scope

Recovered from the existing local Codex project's outputs/ominous directory, under the 2026-10-08 project named referenced-chatgpt-conversation-this-is-an. This is an independent local source recovery; the denied Library download was not retried.

All 19 runtime, fixture, and test SHA256 entries in verification.json match. The 3 preserved example-public files also match the historical public-file hashes. The historical source commit is f46ed85615e287cae5cdfe3118d113656b09d8de; this snapshot does not include its Git history. The Library archive SHA256 was not verified because no original matching ZIP was available.

Only the standalone Core 24 runtime, tests, synthetic fixtures, synthetic example, receipt and upstream README are included. Broad Foundation archives, other cores' source, company rosters, and unrelated private records are excluded. Existing source files and notices are unchanged. No license is added.

Ominous is the Core 24 presentation responsibility; Casper remains Core 02 coordinator. Foundation integration and operational research workers are not implemented by this prototype. Research roles 19–23 remain planned; C4 review and C5 isolation remain unresolved. This work does not resume that extension.

## Fresh verification on 2026-10-09

Command: OMINOUS_BROWSER_QA=0 node --test test/*.test.mjs test/browser.test.cjs

Available runtime: Node v22.23.2, Windows. Package requires Node >=24, so this run does not establish compatibility on its required runtime.

109 cases: 98 passed, 1 failed, 10 skipped. The failure was test setup for "CLI will not follow an existing output symlink": Windows denied symlink creation with EPERM before the target behavior could be tested. No security settings were changed. Browser appearance, interaction, accessibility and motion acceptance remain unrun.

Historical evidence in verification.json records 99 passes and 10 browser cases unrun; it is retained unchanged and is not this run's result. The delegated 103-pass claim could not be substantiated from this recovered snapshot.

A credential-pattern scan of the scoped files found no matches for common GitHub/OpenAI/AWS credentials, private keys, or URL-embedded credentials. Fixtures use explicitly synthetic OMINOUS_PRIVATE markers. This inspection is not a universal secret-detection guarantee.

## Remaining validation

Run the unchanged tests on an authorized Node 24+ host with permitted symlink support; preserve browser checks as unrun unless separately available. The repository upload is complete; no further publication action is implied by these outstanding checks.

## Recovery history — before the 2026-10-09 upload

At the initial recovery check, connected GitHub repository inventory succeeded and showed no Ominous repository. Connector actions expose no repository-creation operation. No browser surfaces are available; in-app browser creation reports unavailable. GitHub CLI was absent from PATH and standard installation locations. No token or broader access was requested.

## Additional revision verification

The independently existing local Ominous GPT handoff ZIP contains source/Ominous-Core-24-Prototype-v0.1.0.zip. Its SHA256 is 4926f7c8734bc6d444b73a92ee808dbbe7f954f3ea1671a338ecc2f59a74f900, matching Source-Provenance.json. All 19 recorded runtime/test/fixture hashes in that nested original match the recovered copy. Plugin-Verification.json explicitly reports unchanged prototype source with 99 prior passes and 10 browser cases unrun. This establishes correspondence to the preserved installed-plugin baseline, not identity with the unavailable Library ZIP (whose expected SHA256 differs). No local evidence establishes the separate 103-pass claim or a newer revision.

No node.exe was found beneath Documents/Codex (including its render-tools), AppData/Local/Codex, AppData/Local/ToolLib, or .codex/cache, .codex/node_repl and .codex/tmp. Standard Program Files/nodejs was also absent. No runtime was installed. Node 24 verification remains pending.

The owner subsequently seeded a private repository named Ominous. The prepared files were uploaded and verified there, and the owner later made it public as recorded above.
