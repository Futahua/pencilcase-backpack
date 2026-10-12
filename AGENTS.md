# Pencilcase — governing document

Pencilcase is the creator's Backpack for defining and managing tools on the actual
machine. Papers is the host machinery; it does not own a competing Tools destination
or product definition. Current creator instructions outrank this document.

Keep the Papers north star: a personal programmable environment on an actual machine,
layered over Windows. Reuse the installed tools and existing execution owners.

Tool names, purposes, list and UI belong here, in public/tools.js and public/app.js.
Papers owns backend availability, safe runtime lifecycles, atomic runtime policies
and measured observations. Do not launch a second tracker or parallel durable writer.

Startup load and always-keep-warm settings must perform real supported actions.
Controls for providers without a resident-runtime contract stay unavailable with a
plain explanation. Never imply that a program is warm because it is installed.
Preserve active documents and unsaved handoffs when changing settings.

Live usage displays observed calls plus native CPU/memory only where reported.
Unknown resource values stay unknown. CPU is the sum across managed engine processes
(100% equals one busy core). Record only on explicit request, once per second, into
separate JSONL files. Do not include document contents, paths or credentials.

public/host.js is generated from As you Go's existing host client; do not maintain
a second handwritten request protocol. Keep project.json and private state out of
public/. Test on an isolated desktop and never take the creator's mouse or keyboard.

ChatGPT local coder is a separate page opened from its tool entry. Its source in
`coder/` was migrated from the retired Delegate Wave Backpack. The existing companion
service owns sessions, authorization and execution; the page uses the existing scoped
Papers relay and never receives credentials. Do not introduce a second agent manager.
Run `npm test`, `npm run typecheck:coder` and `npm run build` for project validation.
