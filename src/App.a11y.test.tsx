import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderAppAt } from './test/renderApp'
import { findA11yViolations } from './test/axe'

describe('accessibility (axe, component)', () => {
  for (const path of [
    '/es',
    '/en',
    '/ja',
    '/es/releases',
    '/es/releases/lirios-del-apocalipsis',
    '/es/releases/el-increible-viaje-de-paquita',
    '/es/bio',
  ]) {
    it(`has no WCAG A/AA violations at ${path}`, async () => {
      const { container } = renderAppAt(path)
      await screen.findByRole('heading', { level: 1 }) // wait for the page to settle
      expect(await findA11yViolations(container)).toEqual([])
    })
  }
})
