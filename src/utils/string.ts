import * as _slug from 'slug'

export function slug(str: string): string {
  return _slug(str, {lower: true})
}
