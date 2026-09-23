# dsh-whale-diving

一个用于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 界面的装饰性鲸鱼动画。当一轮运行中时，聊天流底部会显示 `Deep diving...` 状态；本插件填充它旁边的 `conversation.chat.turnStatusIcon` 席位，用 DeepSeek 鲸鱼标识做一段跃水动画——鲸鱼跃出水面、从喷气孔喷水，再扎回海里溅起水花，一个 3.6 秒的循环。

打开 [`index.html`](index.html) 可以免构建直接预览动画，也可以看[在线演示](https://zerocode321.github.io/dsh-whale-diving/)。

## 效果

- 鲸鱼沿一条弧线运动：浮出水面、跃起、再下沉并淡出。
- 身体随下潜倾斜（`rotate` 最大到 `-25°`），所以看起来是真正在入水，而不是原地弹跳。
- 水用带圆头的 SVG 曲线绘制，靠 `stroke-dashoffset` 一笔画出：
  - `spray` — 鲸鱼跃起时从喷气孔散出的三条水流；
  - `splash` — 入水瞬间水面左右溅起的两条水流；
  - `ripple` — 入水时扩散并淡出的水面涟漪。
- 3.6s 循环，与旁边状态文字的两次扫光对齐；`prefers-reduced-motion` 下禁用动画。

## 原理

插件把一个组件注册进 `ui-conversation` 声明的 `conversation.chat.turnStatusIcon` 席位：

```ts
ctx.slots.inject('conversation.chat.turnStatusIcon', () => ctx.slots.register(
  { name: 'conversation.chat.turnStatusIcon' },
  WhaleDivingLogo,
))
```

图标纯装饰（`aria-hidden`），状态行仍保留可访问的 `Deep diving...` 标签。移除插件即可回退到纯文字，无布局开销。

## 目录结构

```
src/
  index.ts                    # 宿主半体（空 apply，让插件出现在 Loader 里）
  invariant.ts                # 包 invariant 伴生
  css-modules.d.ts
  client/
    index.ts                  # 浏览器半体：注册席位
    WhaleDivingLogo.tsx       # 鲸鱼 + 水的 SVG
    WhaleDivingLogo.module.css# 动画
tests/                        # vitest 测试（在 dsh monorepo 内运行）
index.html                    # 动画独立演示
```

## 安装到 DeepSeek Harness 检出目录

本包是 dsh monorepo 的工作区包，需在该检出目录内构建；另外需要给 `ui-conversation` 加一个小席位。在 `<checkout>` 里：

1. **给 `ui-conversation` 加席位**（三处小改动）：

   - `packages/client/ui-conversation/src/client/contract/slots.ts` — 在 `SlotMap` 里加：

     ```ts
     'conversation.chat.turnStatusIcon': { kind: 'single'; scope: 'session'; owner: TurnStatusIconOwnerProps }
     ```

     并加 `export interface TurnStatusIconOwnerProps {}`，同时把 `ChatViewSlotProps` 放宽为
     `PropsRenderSlots<'conversation.chat.node' | 'conversation.chat.turnStatusIcon'>`。

   - `packages/client/ui-conversation/src/client/apply.ts` — 在 ChatView 入口的 `children` 里加：

     ```ts
     'conversation.chat.turnStatusIcon': { kind: 'single', scope: 'session' },
     ```

   - `packages/client/ui-conversation/src/client/chat/ChatView.tsx` — 在 `TurnStatus` 里渲染席位：

     ```tsx
     {renderSlot('conversation.chat.turnStatusIcon', {})}
     ```

2. **把本目录**拷到 `packages/client/ui-whale-diving`。

3. **注册包**（三处）：

   - `tsconfig.client.json` → 加 `{ "path": "./packages/client/ui-whale-diving" }`。
   - `packages/bundle/web-app/cordis.patch.yml` → 加：
     ```yaml
     - id: ui-whale-diving
       name: '@deepseek-ai/dsh-client-ui-whale-diving'
     ```
   - `packages/bundle/web-app/package.json` → 在 `dependencies` 里加 `"@deepseek-ai/dsh-client-ui-whale-diving": "workspace:^"`。

4. **构建**：

   ```sh
   pnpm install
   pnpm --filter @deepseek-ai/dsh-client-ui-whale-diving run bundle
   ```

5. **重启** `dsh web` 并刷新页面。

## 许可证

[MIT](LICENSE)
