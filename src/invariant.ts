/**
 * Package-owned invariant companion for `@deepseek-ai/dsh-client-ui-whale-diving`.
 * @module @deepseek-ai/dsh-client-ui-whale-diving/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = '@deepseek-ai/dsh-client-ui-whale-diving'

/** Cordis companion plugin name. */
export const name = 'client-ui-whale-diving-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: the whale icon is a purely decorative slot component
 * with no mutable state or event protocol of its own; slot registration and
 * effect disposal are owned and observed by the slots registry.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns The installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */
