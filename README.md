# dsh-whale-diving

> **In the [DSH Collection](https://github.com/ZeroCode321/dsh-collection)** —
> project 03, UI and decorations. The same animation is the pinned-row marker in
> [dsh-workspace-menu](https://github.com/ZeroCode321/dsh-workspace-menu),
> transcribed into that plugin and tuned for a 16px marker strip: dive depth 8px →
> 3px, opacity floor 0 → 0.85.


A decorative whale animation for the [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web GUI. When a turn is running, the chat flow renders a `Deep diving...` status at the bottom; this plugin fills the `conversation.chat.turnStatusIcon` slot beside it with the DeepSeek whale mark animated as a breaching dive — the whale arcs out of the water, sprays from its blowhole, then dives back under with a splash, all in one 3.6s loop.

Open [`index.html`](index.html) to see the animation standalone (no build required), or view the [live demo](https://zerocode321.github.io/dsh-whale-diving/).

## What it looks like

- The whale follows a curved path: it surfaces, breaches, then sinks back under while fading.
- Its body tilts as it dives (`rotate` up to `-25°`), so the motion reads as a real dive rather than a bob.
- Water is drawn as curved SVG strokes that "draw on" via `stroke-dashoffset`:
  - `spray` — three streams fanning from the blowhole as the whale breaches.
  - `splash` — two streams bursting off the surface as it enters.
  - `ripple` — a surface ring that widens and fades on entry.
- A 3.6s cycle aligned with two sweeps of the adjacent status copy. All motion is disabled under `prefers-reduced-motion`.

## How it works

The plugin registers a component into the `conversation.chat.turnStatusIcon` slot (declared by `ui-conversation`):

```ts
ctx.slots.inject('conversation.chat.turnStatusIcon', () => ctx.slots.register(
  { name: 'conversation.chat.turnStatusIcon' },
  WhaleDivingLogo,
))
```

The icon is purely decorative (`aria-hidden`); the status row keeps its accessible `Deep diving...` label. Removing the plugin falls back to the text-only label with zero layout cost.

## Repository layout

```
src/
  index.ts                    # host half (empty apply, so the row exists in the Loader)
  invariant.ts                # package invariant companion
  css-modules.d.ts
  client/
    index.ts                  # browser half: slot registration
    WhaleDivingLogo.tsx       # the whale + water SVG
    WhaleDivingLogo.module.css# the animation
tests/                        # vitest specs (run inside the dsh monorepo)
index.html                    # standalone demo of the animation
```

## Installing into a DeepSeek Harness checkout

This package is a workspace package of the dsh monorepo, so it builds inside that checkout. It also needs one small slot added to `ui-conversation`. In `<checkout>`:

1. **Add the slot to `ui-conversation`** (three small edits):

   - `packages/client/ui-conversation/src/client/contract/slots.ts` — add to `SlotMap`:

     ```ts
     'conversation.chat.turnStatusIcon': { kind: 'single'; scope: 'session'; owner: TurnStatusIconOwnerProps }
     ```

     and `export interface TurnStatusIconOwnerProps {}`, plus widen `ChatViewSlotProps` to
     `PropsRenderSlots<'conversation.chat.node' | 'conversation.chat.turnStatusIcon'>`.

   - `packages/client/ui-conversation/src/client/apply.ts` — in the ChatView entry's `children`:

     ```ts
     'conversation.chat.turnStatusIcon': { kind: 'single', scope: 'session' },
     ```

   - `packages/client/ui-conversation/src/client/chat/ChatView.tsx` — in `TurnStatus`, render the seat:

     ```tsx
     {renderSlot('conversation.chat.turnStatusIcon', {})}
     ```

2. **Copy this directory** to `packages/client/ui-whale-diving`.

3. **Register the package** (three places):

   - `tsconfig.client.json` → add `{ "path": "./packages/client/ui-whale-diving" }`.
   - `packages/bundle/web-app/cordis.patch.yml` → add:
     ```yaml
     - id: ui-whale-diving
       name: '@deepseek-ai/dsh-client-ui-whale-diving'
     ```
   - `packages/bundle/web-app/package.json` → add `"@deepseek-ai/dsh-client-ui-whale-diving": "workspace:^"` to `dependencies`.

4. **Build**:

   ```sh
   pnpm install
   pnpm --filter @deepseek-ai/dsh-client-ui-whale-diving run bundle
   ```

5. **Restart** `dsh web` and refresh the page.

## License

[MIT](LICENSE)
