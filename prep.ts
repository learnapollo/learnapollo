import './src/polyfill'
import { chapters } from './src/utils/content'

export default () => {
  const chapterRoutes = chapters
    .reduce((acc, c) => acc.concat(c.subchapters.map((s) => `/${c.alias}/${s.alias}`)), [])

  return {
    routes: chapterRoutes.concat(['/']),
    https: true,
    concurrency: 50,
    timeout: 10000,
    hostname: 'https://www.learnapollo.com',
    useragent: 'SSR',
  }
}
