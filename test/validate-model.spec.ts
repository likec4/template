import { test } from 'vitest'
import { likec4model } from './likec4-model'

test('Every service has a link to the repository', ({expect }) => {
  expect.hasAssertions()
  for (const e of likec4model.elementsOfKind('service')) {
    // expect.soft allows to accumulate all failures
    expect.soft(
      e.links.find(l => l.title === 'Repository'),
      `Service "${e.id}" has no link to the repository`
    ).toBeDefined()
  }
})

test('Many-to-many relationship allowed only between DB Tables', ({expect }) => {
  for (const r of likec4model.relationshipsWhere({ kind: 'many-to-many' })) {
    expect.soft(
      r.source.kind === 'db-table',
      `Many-to-many relationship "${r.source.id}"->"${r.target.id}" has invalid source`
    ).toBe(true)
    expect.soft(
      r.target.kind === 'db-table',
      `Many-to-many relationship "${r.source.id}"->"${r.target.id}" has invalid target`
    ).toBe(true)
  }
})

// With `test.for` we generate tests for each element of kind `component`
// This improves the output, showing each test failure separately
test.for(
  likec4model
    // Select elements of kind `app`
    .elementsWhere({ kind: 'component' })
    // Map to array of [id, element] tuples, we need it for test names
    .map(e => [e.id, e] as const)
    .toArray(),
)('Component "%s" has technology', ([, e], { expect }) => {
  expect(e.technology).toBeTruthy()
})
