import * as React from 'react'
import {Node} from 'commonmark'
import {hashLinkScroll} from '../../utils/dom'
import Markdown from '../../components/Markdown/Markdown'
import Icon from '../../components/Icon/Icon'
import SharePanel from '../../components/SharePanel/SharePanel'
import {tracks} from '../../utils/content';
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
    const showSharePanel = () => {
      const currentAlias = location.pathname.split('/')[1]
      return currentAlias !== tracks[0].alias || currentAlias === tracks[tracks.length - 1].alias
    }

    return (
      <div className={styles.container} >
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
              style={{ paddingRight: '6px' }}
            />
            <span className='black'>Edit this page</span>
          </a>
        </div>
        {showSharePanel() && <SharePanel/>}
      </div>
    )
  }
}
