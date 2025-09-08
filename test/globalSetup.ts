import { execSync } from 'node:child_process'

export default function() {
  execSync('npm run generate:model')
}
