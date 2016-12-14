import './src/polyfill'
import { chapters } from './src/utils/content'

export default () => {
  const chapterRoutes = chapters
    .reduce((acc, c) => acc.concat(c.subchapters.map((s) => `/${c.alias}/${s.alias}`)), [])

  return {
    routes: chapterRoutes.concat(['/']),
    https: true,
    hostname: 'https://www.learnapollo.com',
  }
}
