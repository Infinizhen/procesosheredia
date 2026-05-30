// Lighthouse CI — the "Standards" gate. Runs real-Chromium audits against the
// built site (served by `npm run preview`, which does SPA fallback) and fails
// the build if accessibility / SEO / best-practices drop below threshold.
// Performance is a non-blocking warning: scores swing with CI machine load.
//
// CommonJS (.cjs) on purpose — package.json sets "type": "module".
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'http://localhost',
      url: [
        'http://localhost:4173/es',
        'http://localhost:4173/en',
        'http://localhost:4173/ja',
        'http://localhost:4173/es/bio',
      ],
      numberOfRuns: 1,
    },
    assert: {
      // Real local scores are 100 across the board, so these floors leave margin.
      // a11y/SEO are core commitments → strict; performance warns (CI-load-sensitive).
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
    },
  },
}
