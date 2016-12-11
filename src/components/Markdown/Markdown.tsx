import * as React from 'react'
import {Node} from 'commonmark'
import * as ReactRenderer from 'commonmark-react-renderer'
import {slug} from '../../utils/string'
import {StoredState} from '../../utils/statestore'
import {PrismCode} from 'react-prism'
import ContentEndpoint from '../ContentEndpoint/ContentEndpoint'
import Sharing from '../Sharing/Sharing'
import Download from '../Download/Download'

const styles: any = require('./Markdown.module.css')

interface Props {
  ast: Node
  sourceName: string
  location: any
}

function childrenToString(children): string {
  if (typeof children === 'string') {
    return children
  }

  return children
    .map((el) => {
      if (typeof el === 'string') {
        return el
      } else {
        return childrenToString(el.props.children)
      }
    })
    .join('')
}

export function replace(ast: Node, regex: RegExp, value: string) {
  const walker = ast.walker()
  let e = walker.next() as any
  while (e !== null) {
    if (e.node._literal) {
      e.node._literal = e.node._literal.replace(regex, value)
    }

    e = walker.next() as any
  }
}

interface Context {
  storedState: StoredState
}

export default class Markdown extends React.Component<Props, {}> {

  static contextTypes = {
    storedState: React.PropTypes.object.isRequired,
  }

  context: Context

  constructor (props, context) {
    super(props)

    if (context.storedState.user) {
      replace(props.ast, /__NAME__/g, context.storedState.user.name)
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    return nextProps.sourceName !== this.props.sourceName || nextProps.location !== this.props.location
  }

  componentWillReceiveProps(nextProps) {
    if (this.context.storedState.user) {
      replace(nextProps.ast, /__NAME__/g, this.context.storedState.user.name)
    }
  }

  render() {
    const self = this
    const renderers = {
      Heading (props) {
        const padding = {
          1: () => 2.3,
          2: () => 1.5,
          3: () => 1.3,
          4: () => 1.2,
          5: () => 1,
        }[props.level]()
        const elProps = {
          key: props.nodeKey,
          id: slug(childrenToString(props.children)),
          className: 'accent',
          style: {
            fontWeight: 300,
            paddingTop: 30,
            paddingBottom: `${padding * 0.4}rem`,
            marginTop: `calc(${padding}rem - 30px)`,
            marginBottom: '1.6rem',
            borderBottom: 'solid rgba(0,0,0,0.1) 1px',
          },
        }
        return React.createElement('h' + props.level, elProps, props.children)
      },
      CodeBlock (props) {
        const className = props.language && 'language-' + props.language
        return (
          <pre>
            <PrismCode className={className}>
              {props.literal}
            </PrismCode>
          </pre>
        )
      },
      HtmlBlock (props) {
        if (props.literal.indexOf('__INJECT_GRAPHQL_ENDPOINT__') > -1) {
          return <ContentEndpoint location={self.props.location} />
        }

        if (props.literal.indexOf('__DOWNLOAD_REACT__') > -1) {
          return <Download location={self.props.location} repository='pokedex-react' />
        }

        if (props.literal.indexOf('__DOWNLOAD_RNVANILLA__') > -1) {
          return <Download location={self.props.location} repository='pokedex-react-native-vanilla' />
        }

        if (props.literal.indexOf('__DOWNLOAD_ANGULAR__') > -1) {
          return <Download location={self.props.location} repository='pokedex-angular' />
        }

        if (props.literal.indexOf('__INJECT_SHARING__') > -1) {
          return <Sharing />
        }

        return ReactRenderer.renderers.HtmlBlock(props)
      },
    }

    const transformImageUri = (uri: string) => {
      if (uri.substr(0, 4) === 'http') {
        return uri
      }
      const filename = uri.replace(/.*\//, '').replace('.png', '')
      return require(`../../../content/images/${filename}.png`)
    }

    const renderer = new ReactRenderer({
      renderers,
      transformImageUri,
    })

    return (
      <div className={`relative ${styles.content}`}>
        {renderer.render(this.props.ast)}
      </div>
    )
  }
}
