import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import '../i18n/config'

// Unmount React trees after each test (RTL auto-cleanup isn't active without
// vitest globals). Without this, renders pile up and queries find duplicates.
afterEach(() => {
  cleanup()
})
