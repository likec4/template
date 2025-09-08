import { defineConfig } from 'likec4/config'

export default defineConfig({
  name: 'likec4-template',
  title: 'LikeC4 Template',
  exclude: [
    'node_modules/**'
  ],
  generators: {
    /**
     * Generates CSV file with relationships to the 
     * 
     */
    'relationships-csv': async ({ likec4model, ctx }) => {
      const lines = [] as string[]
      for (const r of likec4model.relationships()) {
        const loc = ctx.locate(r)
        lines.push(
          [
            `${r.source.id} -> ${r.target.id}`,
            `${r.title || ''}`,
            `${loc.relativePath} [Ln ${loc.range.start.line}, Col ${loc.range.start.character}]`,          
          ]
          .map(s => `"${s.replace('"', '\\"')}"`)
          .join(',')
        )
      }
      // If no relationships found, abort
      if (lines.length === 0) {
        return ctx.abort('No relationships found')
      }
      // Write to file (relative to project root)
      await ctx.write({
        path: 'relationships.csv',
        content: 'relationship,title,location\n' + lines.join('\n')
      })
    }
  },
})
