// @vitest-environment jsdom
/** The whale-diving icon renders the DeepSeek whale mark as aria-hidden chrome. */

import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { WhaleDivingLogo, type WhaleDivingLogoProps } from '../src/client/WhaleDivingLogo.tsx'

describe('WhaleDivingLogo', () => {
  it('renders a decorative whale dive with the brand mark', () => {
    const props = {} as WhaleDivingLogoProps
    const { container } = render(<WhaleDivingLogo {...props} />)

    // Decorative only: the parent status row owns the accessible label.
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
    // The effect layer cannot satisfy the brand-mark assertion by itself.
    expect(container.querySelector('[data-whale-logo] svg')).not.toBeNull()
  })
})
