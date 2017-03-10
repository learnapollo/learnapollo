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
  new Chapter('Overview', 'introduction', false, 'Receive your own GraphQL server and setup your environment to get started with Learn Apollo in the introduction.', [{
    title: 'Introduction',
    alias: 'get-started',
  }]),
  new Chapter('React', 'tutorial-react', true, 'Learn how to easily get started with React and GraphQL with Apollo Client. You will follow a step-by-step tutorial to build a fully-fledged React Pokedex App.',[{
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
  new Chapter('React Native Vanilla', 'tutorial-react-native-vanilla', true, 'Learn how to easily get started with vanilla React Native and GraphQL with Apollo Client. You will follow a step-by-step tutorial to build a fully-fledged vanilla React Native Pokedex App', [{
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
  new Chapter('React Native Expo', 'tutorial-react-native-expo', true, 'Learn how to easily get started with Expo and GraphQL with Apollo Client. You will follow a step-by-step tutorial to build a fully-fledged React Native Pokedex App using Expo.', [{
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
  new Chapter('iOS', 'tutorial-ios', true, 'Learn how to easily get started with iOS, GraphQL and the Apollo iOS Client. You will follow a step-by-step tutorial to build a fully-fledged iOS Pokedex App.', [{
    title: '01 - Getting Started',
    alias: 'ios-01',
  }, {
    title: '02 - Basic Queries',
    alias: 'ios-02',
  }, {
    title: '03 - Advanced Queries',
    alias: 'ios-03',
  }, {
    title: '04 - Fragments',
    alias: 'ios-04',
  }, {
    title: '05 - Basic Mutations',
    alias: 'ios-05',
  }, {
    title: '06 - More Mutations',
    alias: 'ios-06',
  }]),
  new Chapter('Angular 2', 'tutorial-angular', true, 'Learn how to easily get started Angular 2 and GraphQL with Apollo Client. You will use the prepared application as a playground to experiment with an Angular 2 Pokedex App.', [{
    title: 'Playground',
    alias: 'angular-playground',
  }]),
  new Chapter('Vue.js', 'tutorial-vue', true, 'Learn how to easily get started Vue.js and GraphQL with Apollo Client. You will use the prepared application as a playground to experiment with an Vue.js Pokedex App', [{
    title: 'Playground',
    alias: 'vue-playground',
  }]),
  new Chapter('Excursions', 'excursions', false, 'Zoom in on selected concepts to build a better understanding of Apollo Client and GraphQL in these excursions.', [{
    title: '01 - Using the DevTools',
    alias: 'excursion-01',
  }, {
    title: '02 - Managing Apollo store',
    alias: 'excursion-02',
  }]),
  new Chapter('Go Further', 'go-further', false, 'Learn about how you can apply the knowledge you gained about Apollo Client and GraphQL throughout this tutorial in one of your next frontend projects.', [{
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
