import {Parser, Node} from 'commonmark'

export class Chapter {
  title: string
  alias: string
  isTrack: boolean
  description: string
  subchapters: Subchapter[]

  constructor(title: string,
              alias: string,
              isTrack: boolean,
              description: string,
              subchaptersData: SubchapterData[]
  ) {
    this.title = title
    this.alias = alias
    this.isTrack = isTrack
    this.description = description
    this.subchapters = subchaptersData.map((d) => new Subchapter(d.title, d.alias, this))
  }
}

interface SubchapterData {
  title: string
  alias: string
}

interface SubchapterDataWithMeta extends SubchapterData {
  isLast: boolean
}

const parser = new Parser()

class Subchapter {
  title: string
  alias: string
  chapter: Chapter

  constructor(title: string, alias: string, chapter: Chapter) {
    this.title = title
    this.alias = alias
    this.chapter = chapter
  }

  ast(): Node {
    return parser.parse(require(`../../content/${this.chapter.alias}/${this.alias}.md`))
  }
}

export const chapters: Chapter[] = [
  new Chapter('Overview', 'introduction', false, 'Here is a short dasdasdescription...', [{
    title: 'Introduction',
    alias: 'get-started',
  }]),
  new Chapter('React', 'tutorial-react', true, 'Here is a short desasdasdcription...',[{
    title: '01 - Getting Started',
    alias: 'react-01',
  }, {
    title: '02 - Basic Queries',
    alias: 'react-02',
  }, {
    title: '03 - Advanced Queries',
    alias: 'react-03',
  }, {
    title: '04 - Fragments',
    alias: 'react-04',
  }, {
    title: '05 - Basic Mutations',
    alias: 'react-05',
  }, {
    title: '06 - Multiple Mutations',
    alias: 'react-06',
  }, {
    title: '07 - Pagination',
    alias: 'react-07',
  }]),
  new Chapter('React Native Vanilla', 'tutorial-react-native-vanilla', true, 'Here isdasdad a short description...', [{
    title: '01 - Getting Started',
    alias: 'rnv-01',
  }, {
    title: '02 - Basic Queries',
    alias: 'rnv-02',
  }, {
    title: '03 - Advanced Queries',
    alias: 'rnv-03',
  }, {
    title: '04 - Fragments',
    alias: 'rnv-04',
  }, {
    title: '05 - Basic Mutations',
    alias: 'rnv-05',
  }, {
    title: '06 - Multiple Mutations',
    alias: 'rnv-06',
  }]),
  new Chapter('React Native Exponent', 'tutorial-react-native-exponent', true, 'Here is a short description...', [{
    title: '01 - Getting Started',
    alias: 'rne-01',
  }, {
    title: '02 - Basic Queries',
    alias: 'rne-02',
  }, {
    title: '03 - Advanced Queries',
    alias: 'rne-03',
  }, {
    title: '04 - Fragments',
    alias: 'rne-04',
  }, {
    title: '05 - Basic Mutations',
    alias: 'rne-05',
  }]),
  new Chapter('Angular 2', 'tutorial-angular', true, 'Here is a sddadasdhort description...', [{
    title: 'Playground',
    alias: 'angular-playground',
  }]),
  new Chapter('Vue.js', 'tutorial-vue', true, 'Here is a short description...', [{
    title: 'Playground',
    alias: 'vue-playground',
  }]),
  new Chapter('Excursions', 'excursions', false, 'Here is a shorasdasdt description...', [{
    title: '01 - Using the DevTools',
    alias: 'excursion-01',
  }, {
    title: '02 - Mutation Results',
    alias: 'excursion-02',
  }]),
  new Chapter('Go Further', 'go-further', false, 'Here is a short description...', [{
    title: 'Wrap Up',
    alias: 'wrap-up',
  }]),
]

export const subchapters: Subchapter[] = chapters.map((c) => c.subchapters).reduce((acc, s) => acc.concat(s), [])

// adds `isLast` property and returns all subchapters
const subchaptersWithMeta = chapters
  .map(chapter => chapter.subchapters
    .map((subchapter, index) => (
        Object.assign(
          {},
          subchapter,
          {isLast: chapter.subchapters.length - 1 === index}
        ) as SubchapterDataWithMeta
      )
    )
  )
  .reduce((acc, s) => acc.concat(s), [])

export function neighboorSubchapter(currentSubchapterAlias: string, forward: boolean): Subchapter | null {
  const index = subchapters.findIndex((s) => s.alias === currentSubchapterAlias)
  const currentIndex = index === -1 ? 0 : index
  if (forward && currentIndex + 1 <= subchapters.length) {
    return subchaptersWithMeta[currentIndex].isLast && currentIndex !== 0 && currentIndex < subchapters.length - 1
      ? subchapters[subchapters.length - 1] : subchapters[currentIndex + 1]
  } else if (!forward && currentIndex >= 1) {
    return subchapters[currentIndex - 1]
  }

  return null
}

export function getLastSubchapterAlias(subchapterAliases: string[]): string {
  let lastFinding = subchapterAliases[0]
  for (let i = 0; i < subchapters.length; i++) {
    if (subchapterAliases.includes(subchapters[i].alias)) {
      lastFinding = subchapters[i].alias
    }
  }
  return lastFinding
}
