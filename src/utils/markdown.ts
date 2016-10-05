import {Node} from 'commonmark'

export interface HeadingNode {
  title: string | null
  children: HeadingNode[]
}

export interface Heading {
  level: number
  title: string
}

function inject(root: HeadingNode, title: string, level: number): HeadingNode {
  if (level === 1) {
    root.title = title
  } else {
    if (level === 2 || root.children.length === 0) {
      root.children.push({
        title: null,
        children: [],
      })
    }
    const lastChild = root.children[root.children.length - 1]
    inject(lastChild, title, level - 1)
  }

  return root
}

export function collectHeadings(ast: Node): Heading[] {
  const walker = ast.walker()
  let e = walker.next() as any
  let headings: Heading[] = []
  while (e !== null) {
    if (e.entering && e.node._type === 'heading') {
      let title = ''
      let next = e.node._firstChild
      while (next !== null) {
        title += next._literal
        next = next.next
      }
      headings.push({
        title,
        level: e.node._level,
      })
    }

    e = walker.next() as any
  }

  return headings
}

export function buildHeadingsTree(headings: Heading[]): HeadingNode[] {
  return headings
    .reduce(
      (root: HeadingNode, heading: Heading) => inject(root, heading.title, heading.level),
      {title: null, children: []}
    )
    .children
}
