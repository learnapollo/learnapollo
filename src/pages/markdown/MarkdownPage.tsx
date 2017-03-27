import * as React from 'react'
import * as Helmet from 'react-helmet'
import {Node} from 'commonmark'
import {hashLinkScroll} from '../../utils/dom'
import Markdown from '../../components/Markdown/Markdown'
import { Icon } from 'graphcool-styles'
import SharePanel from '../../components/SharePanel/SharePanel'
import { chapters, getTitleFromChapter, getTitleFromSubchapter } from '../../utils/content'
const styles: any = require('./MarkdownPage.module.styl')

interface Props {
  params: any
  ast: Node
  sourceName: string
  location: any
}

interface Context {
  updateStoredState: (keyPath: string[], value: any) => void
}

export default class MarkdownPage extends React.Component<Props, {}> {

  static contextTypes = {
    updateStoredState: React.PropTypes.func.isRequired,
  }

  context: Context

  componentDidMount() {
    this.context.updateStoredState(['hasRead', this.props.params.subchapter], true)

    if (this.props.location.hash !== '') {
      hashLinkScroll()
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.params.subchapter !== this.props.params.subchapter) {
      this.context.updateStoredState(['hasRead', this.props.params.subchapter], true)
    }
  }

  render() {
    const currentAlias = location.pathname.split('/')[1]
    const showSharePanel = (): boolean => {
      const introAlias: string = chapters[0].alias
      const overviewAlias: string = chapters[chapters.length - 1].alias
      return currentAlias !== introAlias && currentAlias !== overviewAlias
    }
    const currentSubalias = location.pathname.split('/')[2]
    const title = `${getTitleFromSubchapter(currentSubalias)} - ${getTitleFromChapter(currentAlias)} + Apollo Tutorial`

    return (
      <div className={styles.container} >
        <Helmet
          title={title}
          meta={[
            {property: 'og:title', content: title},
            {name: 'twitter:title', content: title},
          ]}
        />
        <Markdown
          ast={this.props.ast}
          sourceName={this.props.sourceName}
          location={this.props.location}
        />
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <a
            href={`https://github.com/learnapollo/learnapollo/blob/master/content/${this.props.sourceName}`}
            target='_blank'
            className={`pv3 flex items-center ${styles.github}`}
          >
            <Icon
              src={require('../../assets/icons/github.svg')}
            />
            <span
              className='black'
              style={{ paddingLeft: '6px' }}
            >
              Edit this page
            </span>
          </a>
        </div>
        {showSharePanel() && <SharePanel/>}
      </div>
    )
  }
}
