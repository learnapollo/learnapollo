const _slug = require('slugify')

export function slug(str: string): string {
  return _slug(str, {lower: true})
}
