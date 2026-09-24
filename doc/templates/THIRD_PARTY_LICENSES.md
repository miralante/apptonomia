# Third-party licenses

> Optional. Delete this file in a new sibling that ships **no**
> third-party content (default — vanilla code, fonts, and CC0 audio
> or video only). Keep it when the sibling ships user-facing content
> or images under a non-MIT license.

The main code in this repository is licensed under the
[MIT License](LICENSE) of the Miralante {{DISPLAY_EN}} project. This
file documents the licenses of the third-party assets shipped in the
deployed site.

---

## Content under {{#HAS_CONTENT_CC_BY_SA}}CC BY-SA 4.0

(This section is required if the sibling ships user-authored lexicon,
illustrative examples, or similar content intended to be reusable.)

The content under `js/data.<lang>.js` (or the per-language shard
files listed in the manifest, when the dataset is sharded) is licensed
under the **Creative Commons Attribution-ShareAlike 4.0 license
(CC BY-SA 4.0)**, separate from the MIT license above.

- Full license text:
  <https://creativecommons.org/licenses/by-sa/4.0/>
- Legal code: <https://creativecommons.org/licenses/by-sa/4.0/legalcode>

Recommended attribution when reusing:

> "{{DISPLAY_EN}} content, Miralante suite, licensed under CC BY-SA
> 4.0."

Each entry also carries its own context (e.g. `fuente`) under the
same license when the entry is not fully original to this project.

## Content under {{/HAS_CONTENT_CC_BY_SA}}{{#HAS_THIRD_PARTY_IMAGES}}permissive licenses

(This section is required if any card / entry carries an `imagen`
field sourced from a third-party bank.)

Card images are sourced from a **permissively-licensed image bank**
(see the per-sibling image-sourcing recipe in that sibling's
`CLAUDE.md`). Permitted licenses are CC0, CC BY, CC BY-SA.

Rejected licenses: `-NC` (non-commercial) and `-ND` (no-derivatives).
Any candidate carrying one of these is filtered out at selection
time.

Every image carries a **TASL** attribution block on the card:

- `titulo` — title of the source artwork
- `autor` — author / rights holder
- `fuente` — canonical URL of the source page
- `licencia` — the exact license identifier

The UI surfaces this credit per card; reusing an image means keeping
that block intact.

### Bank used

*List the bank(s) used by this sibling — pick one of:*

- **Openverse** — <https://openverse.org>, per-result license.
- **Wikimedia Commons** — <https://commons.wikimedia.org>,
  per-file license.

## Bank used{{/HAS_THIRD_PARTY_IMAGES}}

---

If you have a question about reusing any of the above, open an issue
and tag it with the `legal` label.
